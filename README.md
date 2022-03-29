# Localstack demo - Pizza ordering service

This directory contains the code for a Node.JS application for a talk on how to leverage Localstack in your development environment. The application is a dummy pizza ordering system that uses as much AWS services as possible.

## Architecture overview

- Order pizza flow
  - Mobile/web clients call server's POST endpoint /orders
  - Validate input data by doing some DynamoDB lookups
  - Send order to SQS queue
  - Push `order_created` event to firehose
  - Worker consumes message the insert the order into a DynamoDB table
  - Push `order_processed` event to firehose

In summary, we need to mock all of the following AWS services:
- DynamoDB
- SQS
- Firehose
- S3
- SSM (Let's assume the application needs to fetch one secret key from SSM as well.)

## Local development

AWS CLI commands for interacting with the localstack infrastructure.
```bash

# See order entries in dynamo
aws dynamodb scan --table-name pizza-ordering-dev --endpoint http://localhost:4566  --region us-east-1

# See order event files in s3
 aws s3 ls s3://order-events --recursive --endpoint http://localhost:4566  --region us-east-1

# Get object from s3
aws s3api get-object --bucket order-events --key test-log/2022/03/29/04/order-events-stream-dev-2022-03-29-04-46-32-7f6ce84e-04ee-4557-9996-a3e66796f9f5 event.txt --endpoint http://localhost:4566  --region us-east-1
```


```sh
docker exec localstack bin/localstack status services
```
