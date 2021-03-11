provider "aws" {
  region = "us-east-1"
  profile = "interactives"
}

terraform {
  backend "s3" {
  bucket = "politico-terraform-configs"
  key = "configs/lambda-gootenberg-api/terraform.tfstate"
  region = "us-east-1"
  profile = "interactives"
  encrypt = true
  }
}

variable "project_slug" {
  type = string
}

resource "aws_iam_role" "role" {
  name = "${var.project_slug}__role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "function" {
  filename = "upload.zip"
  function_name = var.project_slug
  handler = "index.handler"
  source_code_hash = filebase64sha256("upload.zip")
  role= aws_iam_role.role.arn
  runtime="nodejs12.x"
  timeout=600
  memory_size=2048
  environment {
    variables = {
      AWS = "true"
    }
  }
  layers = [
    "arn:aws:lambda:us-east-1:041537238831:layer:lambda_layer-awssdk:1",
  ]
}

resource "aws_iam_policy" "policy" {
  name        = "${var.project_slug}__policy"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:CreateLogGroup",
        "lambda:InvokeFunction",
        "ssm:GetParameters"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attachment" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_api_gateway_rest_api" "gateway" {
  name = "${var.project_slug}__api"
}

resource "aws_api_gateway_resource" "resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway.id
  parent_id   = aws_api_gateway_rest_api.gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "method" {
   rest_api_id   = aws_api_gateway_rest_api.gateway.id
   resource_id   = aws_api_gateway_resource.resource.id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_method" "method_root" {
   rest_api_id   = aws_api_gateway_rest_api.gateway.id
   resource_id   = aws_api_gateway_rest_api.gateway.root_resource_id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
   rest_api_id = aws_api_gateway_rest_api.gateway.id
   resource_id = aws_api_gateway_method.method.resource_id
   http_method = aws_api_gateway_method.method.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.function.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_root" {
   rest_api_id = aws_api_gateway_rest_api.gateway.id
   resource_id = aws_api_gateway_method.method_root.resource_id
   http_method = aws_api_gateway_method.method_root.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.function.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
   depends_on = [
     aws_api_gateway_integration.lambda,
     aws_api_gateway_integration.lambda_root,
   ]

   rest_api_id = aws_api_gateway_rest_api.gateway.id
   stage_name  = "prod"
}

resource "aws_lambda_permission" "apigw" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.function.function_name
   principal     = "apigateway.amazonaws.com"

   source_arn = "${aws_api_gateway_rest_api.gateway.execution_arn}/*/*"
}

output "base_api_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}
