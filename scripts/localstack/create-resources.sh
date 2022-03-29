#!/bin/bash
set -x

cd /docker-entrypoint-initaws.d

# CREATES DYNAMODB TABLES
awslocal dynamodb create-table --cli-input-json file://dynamodb.json

# CREATES S3 BUCKETS
awslocal s3 mb s3://order-events

# PUTS SECRETS IN SSM
awslocal ssm put-parameter --name api_secret --value topsecret123

# CREATES FIREHOSE STREAMS
awslocal firehose create-delivery-stream --cli-input-json file://firehose.json

# CREATES SQS QUEUES
awslocal sqs create-queue --queue-name orders-queue-dev --attributes file://sqs.json

# Insert pizza entries into dynamo
awslocal dynamodb batch-write-item \
    --request-items file://dynamodb-migration.json \
    --return-consumed-capacity INDEXES \
    --return-item-collection-metrics SIZE

set +x
