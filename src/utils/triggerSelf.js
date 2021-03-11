import AWS from 'aws-sdk';

export default (payload) => {
  const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME;

  const lambda = new AWS.Lambda({
    region: 'us-east-1',
    credentials: new AWS.Credentials(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
      process.env.AWS_SESSION_TOKEN || null,
    ),
  });

  const params = {
    FunctionName: functionName,
    InvocationType: 'Event',
    Payload: JSON.stringify(payload),
  };

  return new Promise((resolve, reject) => {
    lambda.invoke(params, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
};
