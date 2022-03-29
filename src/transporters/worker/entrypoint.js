const {
  dynamodb,
  firehose,
  s3,
  sqs,
  ssm
} = require('../../data-sources')
const logger = require('../../utils/logger')('WORKER_ENTRYPOINT')
const worker = require('./worker')

async function run () {
  try {
    await Promise.all([
      dynamodb.ping(),
      firehose.ping(),
      s3.ping(),
      sqs.ping(),
      ssm.ping()
    ])
  } catch (error) {
    process.exit(1)
  }

  worker.run()

  logger.info({
    message: 'SQS Worker is up and kicking'
  })
}

run()
