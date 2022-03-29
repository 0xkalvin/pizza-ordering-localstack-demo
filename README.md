# Localstack demo - Pizza ordering service

This repo contains a Node.JS application for a talk on how to leverage Localstack in your development environment. The application is a dummy pizza ordering system that uses as much AWS services as possible.

## Architecture overview

- Order pizza flow
  - Clients call server on POST endpoint /orders
  - Server validates input data by doing some DynamoDB lookups
  - Server sends order through an SQS queue
  - Server pushes `order_created` event to firehose
  - SQS Consumer gets the order message, and inserts it into a DynamoDB table
  - SQS Consumer pushes `order_processed` event to firehose

In summary, we need to mock all of the following AWS services:
- DynamoDB
- SQS
- Firehose
- S3
- SSM (Let's assume the application needs to fetch one secret key from SSM as well.)

## API reference
### Create a pizza order

Request
```bash
curl --request POST \
  --url http://localhost:3000/orders \
  --header 'Content-Type: application/json' \
  --header 'x-customer-id: 123' \
  --data '{
	 "items": [
		 {
			 "product_id": "pepperoni",
			 "quantity": 1
		 }
	 ],
   "payment_method": "credit_card",
   "total_price": 1000
}'
```
Response
```json
{
	"id": "3e98f41b-1637-47f0-95b0-9d09bb874b59"
}
```

## Local development

You can start up the project with `make` or directly with `docker compose`
```sh
make
```
or
```sh
docker-compose up pizza-ordering-server pizza-ordering-worker
```

That will initialize the localstack container, server container and worker container.


AWS CLI commands for interacting with the localstack infrastructure.
```bash

# See order entries in dynamo
aws dynamodb scan --table-name pizza-ordering-dev --endpoint http://localhost:4566  --region us-east-1

# See order event files in s3
 aws s3 ls s3://order-events --recursive --endpoint http://localhost:4566  --region us-east-1

# Get object from s3
aws s3api get-object --bucket order-events --key OBJECT_KEY output.txt --endpoint http://localhost:4566  --region us-east-1
```

See available localstack services
```sh
docker exec localstack bin/localstack status services
```
