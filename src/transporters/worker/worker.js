const { Poller } = require('sqs-poller')

const {
  sqs
} = require('../../data-sources')
const logger = require('../../utils/logger')('WORKER')
const service = require('../../services/order')

const {
  SQS_ORDER_QUEUE_URL
} = process.env

function run () {
  const poller = new Poller({
    queueUrl: SQS_ORDER_QUEUE_URL,
    sqsClient: sqs.client
  })

  poller.start({
    eachMessage: async (message) => {
      try {
        const order = JSON.parse(message.Body)

        await service.processOrder(order)
      } catch (error) {
        if (error.retryable) {
          throw error
        }

        logger.error({
          message: 'Unretryable error during order processing',
          error_message: error.message,
          error_stack: error.stack
        })
      }
    }
  })

  poller.on('error', logger.error)
}

module.exports = {
  run
}
