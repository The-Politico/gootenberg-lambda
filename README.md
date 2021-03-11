# Gootenberg on Lambda

An API for all of Gootenberg's services, authenticated with a simple token.

## Why This?

Because Gootenberg is great, but sometimes you don't want to set up fancy service account keys on your computer. Sometimes, you just want a single token auth. Also, this allows you to essentially run Gootenberg code in Python (using requests).

## API Reference

All API routes match the pattern `<SERVICE_NAME>/<METHOD_NAME>` based on the existing Gootenberg functions. Each request should have an `Authorization` header that takes the form:

```
"Token <YOUR_GOOTENBERG_API_TOKEN_HERE>"
```

Then pass what would be the arguments for the function as a JSON string (such as the result of a JSON.stringify). Below are example of what those bodies would look like (before they are converted into a string), as well as what a sample response would look like (assuming a `200` response).

### [/drive/copy/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.copy.md)

#### Sample Request Body
```
{
  "src": "GOOGLE_FILE_ID_HERE",
  "destination": "GOOGLE_FOLDER_ID_HERE",
  "title": "Name of copy"
}
```

#### Sample Response Body
Content Type: *application/json*

```
{
  "kind": "drive#file",
  "id": "NEW_GOOGLE_FILE_ID",
  "name": "Name of copy",
  "mimeType": "application/vnd.google-apps.document"
}
```

### [/drive/comments/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.comments.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_FILE_ID_HERE",
}
```

#### Sample Response Body
Content Type: *application/json*

```
[
  {
    "kind": "drive#comment",
    "id": "COMMENT_ID_HERE",
    "createdTime": "2021-03-10T21:31:50.792Z",
    "modifiedTime": "2021-03-10T21:31:50.792Z",
    "author": {
      "kind": "drive#user",
      "displayName": "Andrew Briz",
      "photoLink": "<REDACTED>",
      "me": false
    },
    "htmlContent": "Foo Bar",
    "content": "Foo Bar",
    "deleted": false,
    "resolved": false,
    "quotedFileContent": {
      "mimeType": "text/html",
      "value": "World"
    },
    "anchor": "kix.wyaoagk03w8a",
    "replies": []
  }
]
```

### [/drive/export/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.export.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_FILE_ID_HERE",
}
```

#### Sample Response Body
Content Type: *text/plain*

```
Text in the file
```


### [/drive/files/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.files.md)

#### Sample Request Body
See documentation on this function for help writing queries.

```
{
  "query": "name = "FILE NAME"",
}
```

#### Sample Response Body
Content Type: *application/json*

```
[
  {
    "kind": "drive#file",
    "id": "GOOGLE_FILE_ID_HERE",
    "name": "NAME_OF_FILE",
    "mimeType": "application/vnd.google-apps.document"
  },
  {
    "kind": "drive#file",
    "id": "GOOGLE_FILE_ID_HERE",
    "name": "NAME_OF_FILE",
    "mimeType": "application/vnd.google-apps.document"
  }
]
```

### [/drive/ls/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.ls.md)

#### Sample Request Body
```
[
  {
    "kind": "drive#file",
    "id": "1b8YSPpDlXkoRPL3qcnqnIlf3zRvGSUBe",
    "name": "delete",
    "mimeType": "application/vnd.google-apps.folder"
  },
  {
    "kind": "drive#file",
    "id": "1pnMChuvcXMQlKRQdDmTXYQK87Nhwy6SghnxS9AnEfXo",
    "name": "comments",
    "mimeType": "application/vnd.google-apps.document"
  },
  {
    "kind": "drive#file",
    "id": "1eKkYx_wA1YhlShvACV0UjkWIJAcYPL3A",
    "name": "Move To",
    "mimeType": "application/vnd.google-apps.folder"
  }
]
```

#### Sample Response Body
Content Type: *application/json*

```
[
  {
    "kind": "drive#file",
    "id": "GOOGLE_ID",
    "name": "FILE_NAME",
    "mimeType": "application/vnd.google-apps.folder"
  },
  {
    "kind": "drive#file",
    "id": "GOOGLE_ID",
    "name": "FILE_NAME",
    "mimeType": "application/vnd.google-apps.document"
  },
  {
    "kind": "drive#file",
    "id": "GOOGLE_ID",
    "name": "FILE_NAME",
    "mimeType": "application/vnd.google-apps.folder"
  }
]
```

### [/drive/move/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.move.md)

#### Sample Request Body
```
{
  "src": "GOOGLE_FILE_ID_HERE",
  "destination": "GOOGLE_FOLDER_ID_HERE"
}
```

#### Sample Response Body
Content Type: *application/json*

```
```

### [/drive/rename/](https://github.com/The-Politico/gootenberg/blob/main/docs/drive.rename.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_FILE_ID_HERE",
  "title": "New Title for File"
}
```

#### Sample Response Body
*No response body.*

### [/docs/append/](https://github.com/The-Politico/gootenberg/blob/main/docs/docs.append.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_DOC_ID_HERE",
  "content": "Content to add here"
}
```

#### Sample Response Body
Content Type: *application/json*

```
{
  "replies": [
    {}
  ],
  "writeControl": {
    "requiredRevisionId": "REVISION_ID_HERE"
  },
  "documentId": "GOOGLE_ID_HERE"
}
```

### [/docs/create/](https://github.com/The-Politico/gootenberg/blob/main/docs/docs.create.md)

#### Sample Request Body
```
{
  "title": "Name for Document",
  "directory": "GOOGLE_FOLDER_ID_HERE"
}
```

#### Sample Response Body
Content Type: *application/json*

Some of the response below has been truncated. This endpoint will respond with a Google Document object which you can read more about [here.](https://developers.google.com/docs/api/reference/rest/v1/documents#Document)

```
{
  "title": "Hello World",
  "body": { ... },
  "documentStyle": { ... },
  "namedStyles": { ... },
  "revisionId": "REVISION_ID_HERE",
  "suggestionsViewMode": "SUGGESTIONS_INLINE",
  "documentId": "GOOGLE_ID_HERE"
}
```

### [/docs/get/](https://github.com/The-Politico/gootenberg/blob/main/docs/docs.get.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_DOC_ID_HERE",
}
```

#### Sample Response Body
Content Type: *application/json*

Some of the response below has been truncated. This endpoint will respond with a Google Document object which you can read more about [here.](https://developers.google.com/docs/api/reference/rest/v1/documents#Document)

```
{
  "title": "Hello World",
  "body": { ... },
  "documentStyle": { ... },
  "namedStyles": { ... },
  "revisionId": "REVISION_ID_HERE",
  "suggestionsViewMode": "SUGGESTIONS_INLINE",
  "documentId": "GOOGLE_ID_HERE"
}
```

### [/sheets/appendRows/](https://github.com/The-Politico/gootenberg/blob/main/docs/sheets.appendRows.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_SHEET_ID_HERE",
  "values": [
    [
      "Row 1 Column 1 Value",
      "Row 1 Column 2 Value"
    ],
    [
      "Row 2 Column 1 Value",
      "Row 2 Column 2 Value"
    ]
  ]
}
```

#### Sample Response Body
*No response body.*


### [/sheets/create/](https://github.com/The-Politico/gootenberg/blob/main/docs/sheets.create.md)

#### Sample Request Body
```
{
  "title": "Name for Sheet",
  "directory": "GOOGLE_FOLDER_ID_HERE"
}
```

#### Sample Response Body
Content Type: *application/json*

Some of the response below has been truncated. This endpoint will respond with a Google Spreadsheet object which you can read more about [here.](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet)

```
{
    "spreadsheetId": "GOOGLE_ID_HERE",
    "properties": { ... },
    "sheets": [ ... ],
    "spreadsheetUrl": "URL_HERE"
}
```

### [/sheets/getAll/](https://github.com/The-Politico/gootenberg/blob/main/docs/sheets.getAll.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_SHEET_ID_HERE",
}
```

#### Sample Response Body
Content Type: *application/json*

```
{
  "spreadsheetId": "GOOGLE_SHEET_ID_HERE",
  "valueRanges": [
    {
      "range": "Sheet1!A1:Z1002",
      "majorDimension": "ROWS",
      "values": [
        [
          "Row 1 Column 1 Value",
          "Row 1 Column 2 Value"
        ],
        [
          "Row 2 Column 1 Value",
          "Row 2 Column 2 Value"
        ]
      ]
    }
  ]
}
```

### [/parse/archie/](https://github.com/The-Politico/gootenberg/blob/main/docs/parse.archie.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_DOC_ID_HERE",
}
```

#### Sample Response Body
Content Type: *application/json*

This endpoint will respond with the result of the parse, so it will take the form of a JSON object with any combination of keys and data inside.

```
{
  "KeyOne": "ValueOne",
  "KeyTwo": "ValueTwo"
}
```

### [/parse/table/](https://github.com/The-Politico/gootenberg/blob/main/docs/parse.table.md)

#### Sample Request Body
```
{
  "id": "GOOGLE_SHEET_ID_HERE",
}
```

#### Sample Response Body
Content Type: *application/json*

```
{
  "Sheet Name": [
    {
        "Column One": "Hello",
        "Column Two": "Olleh"
    },
    {
        "Column One": "World",
        "Column Two": "Dlrow"
    },
    {
        "Column One": "Foo",
        "Column Two": "Oof"
    },
    {
        "Column One": "Bar",
        "Column Two": "Rab"
    }
  ],
}
```



## Set Up

Set up your env by copping `.env.template` as `.env`, and fill it out.

```
$ cp .env.template .env
```

This API will try to use [AWS's Parameter Store](AWS Systems Manager Parameter Store - AWS Systems Manager) by default. If you have your AWS keys set up in your .env, you can instead keep the following values in your Parameter Store and this API will grab those values on startup (the names must be spelled exactly like this in your store):

- `GOOTENBERG_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`

If you would prefer to handle your Lambda's env another way, go for it. Keep in mind though, that Lambda has no built-in way to properly store secret values. It's all plain text. If you choose not to use Parameter Store, you'll have to make sure those three values make it to your Lambda's environment somehow. AWS keys should already be set up by default on Lambda, so don't worry about those.

Next, use [Terraform](https://registry.terraform.io/) to set everything up. If this is your first time using Terraform, it can feel a bit daunting to set up. Use [this guide](https://learn.hashicorp.com/tutorials/terraform/install-cli) for help installing it and [this guide](https://learn.hashicorp.com/tutorials/terraform/aws-build) for help connecting your AWS account. Once you have Terraform installed and your AWS credentials set up, it's just a few commands to get the Gootenberg API ready.

Initialize your Terraform instance with:
```
$ yarn t-init
```

Then simply build and ship your API:
```
$ yarn build
$ yarn ship
```

### What's being set up exactly
Most of these services have a free tier and if you use ONLY this app you're unlikely to have to pay more then a few cents a month. But here's a quick list of resources terraform is setting up for you:

- Lamda: The main app which is running Gootenberg commands for you
- CloudWatch: This is where the console logs from Lambda will go
- API Gateway: This is what receives the requests and passes them to the lambda
- And various permissions to make these three work.
