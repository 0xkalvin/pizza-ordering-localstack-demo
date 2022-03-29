const { Firehose } = require('aws-sdk')

const logger = require('../utils/logger')('FIREHOSE')

const {
  FIREHOSE_ENDPOINT,
  FIREHOSE_REGION,
  FIREHOSE_ORDER_STREAM_URL
} = process.env

const firehose = new Firehose({
  endpoint: FIREHOSE_ENDPOINT,
  region: FIREHOSE_REGION
})

async function createEvent (event) {
  try {
    const result = await firehose.putRecord({
      DeliveryStreamName: FIREHOSE_ORDER_STREAM_URL,
      Record: {
        Data: JSON.stringify(event)
      }
    }).promise()

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to create event on firehose',
      error_message: error.message,
      error_stack: error.stack
    })
  }
}

async function ping () {
  try {
    const result = await firehose.describeDeliveryStream({
      DeliveryStreamName: FIREHOSE_ORDER_STREAM_URL
    }).promise()

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to ping firehose',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

module.exports = {
  createEvent,
  ping
}
