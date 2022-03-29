const { SQS } = require('@aws-sdk/client-sqs')

const logger = require('../utils/logger')('SQS')

const {
  SQS_ENDPOINT,
  SQS_REGION,
  SQS_ORDER_QUEUE_URL
} = process.env

const sqs = new SQS({
  endpoint: SQS_ENDPOINT,
  region: SQS_REGION
})

async function enqueueOrder (order) {
  try {
    const result = await sqs.sendMessage({
      QueueUrl: SQS_ORDER_QUEUE_URL,
      MessageBody: JSON.stringify(order)
    })

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to enqueue order on SQS',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

async function ping () {
  try {
    const result = await sqs.listQueueTags({
      QueueUrl: SQS_ORDER_QUEUE_URL
    })

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to ping SQS',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

module.exports = {
  client: sqs,
  enqueueOrder,
  ping
}
