---
title: "S3 upload object tagging in AWS Lambda"
date: "2020-01-14T12:01:00Z"
tags: ["aws", "lambda"]
categories: ["Development"]
---

AWS SAM allows you to choose from ready-made policy templates to scope the permissions
of Lambda functions. You might experience an "Access Denied" error when you play around
with the AWS SDK. It's always a good idea to review the permissions of your application
and required permissions to execute the function.<!--more-->

The list of policy templates can be found in the [serverless policy template table].

If you are using, for example, the [S3CrudPolicy] to put objects into a bucket, you might experience
an error similar to the one below while you are putting objects into the bucket with a custom tagging.

```
ERROR	Invoke Error 	{"errorType":"AccessDenied","errorMessage":"Access Denied","code":"AccessDenied","message":"Access Denied","region":null,"time":"2020-01-14T22:40:58.757Z","requestId": "...", ...}
```

After reviewing the [S3CrudPolicy] you will realise that the object tagging permission is not part
of the list of allowed actions. To tag the uploaded object, the access policy needs
to have the **s3:PutObjectTagging** permissions which is part of the [S3FullAccessPolicy].

This quick permission fix will enable you to tag uploaded objects.


## Example lambda function

Let's create an example lambda function which will create a new text file, tag the file
and put it into the S3 bucket.

**index.js**

```javascript
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async (event) => {

    var buffer = Buffer.from("Hello lambda function!", "utf-8");
    var params = {
        Body: buffer, 
        Bucket: "MyBucket", 
        Key: "hello-lambda.txt",
        Tagging: "myTag1=hello&myTag2=lambda"
    };
    
    try {
        const { Body } = await s3.putObject(params).promise();

        return Promise.resolve(Body);
    } catch(err) {
        return Promise.reject(err);
    }
};
```

The belonging template file with the correct S3 bucket policy will look like this:


**template.yaml**

```yaml
...

Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./src
      Handler: index.handler
      Runtime: nodejs10.x
      Description: My lambda function
      Policies: 
        - S3FullAccessPolicy:
            BucketName: MyBucket

...
```

After running this lambda function you should see a new file `hello-lambda.txt` in the `MyBucket`. 
When you review properties of the uploaded file you should see your created tags under the *Tags* 
property:

![S3 Object tagging](/img/hello-lambda-tags.png "S3 Object tagging")




[serverless policy template table]: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html#serverless-policy-template-table
[S3CrudPolicy]: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-template-list.html#s3-crud-policy
[S3FullAccessPolicy]: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-template-list.html#s3-full-access-policy
