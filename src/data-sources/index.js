const dynamodb = require('./dynamodb')
const firehose = require('./firehose')
const s3 = require('./s3')
const sqs = require('./sqs')
const ssm = require('./ssm')

module.exports = {
  dynamodb,
  firehose,
  s3,
  sqs,
  ssm
}
