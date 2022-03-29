const crypto = require('crypto')

const {
  dynamodb,
  firehose,
  sqs,
  ssm
} = require('../data-sources')

async function createOrder (payload) {
  const {
    customerId,
    items,
    paymentMethod,
    totalPrice
  } = payload

  const orderId = crypto.randomUUID()

  const pizzaToppings = await dynamodb.getAvailablePizzaToppings()

  const areAllPizzasValid = items.every((item) => pizzaToppings.has(item.product_id))

  if (!areAllPizzasValid){
    const error = new Error('Invalid pizza topping')
    error.statusCode = 422
    throw error
  }

  await sqs.enqueueOrder({
    customerId,
    items,
    paymentMethod,
    totalPrice,
    id: orderId
  })

  const eventId = crypto.randomUUID()

  firehose.createEvent({
    id: eventId,
    customerId,
    orderId,
    eventType: 'order_created'
  })

  return {
    id: orderId
  }
}

async function processOrder (payload) {
  const order = {
    ...payload,
    status: 'processed'
  }

  const appSecretKey = await ssm.getAppSecretKey()

  const signature = crypto.createHmac('sha256', appSecretKey)
  .update(JSON.stringify(order))
  .digest('hex');


  await dynamodb.createOrder({
    ...order,
    signature
  })

  const eventId = crypto.randomUUID()

  firehose.createEvent({
    id: eventId,
    customerId: order.customerId,
    orderId: order.id,
    eventType: 'order_processed',
    signature
  })
}

module.exports = {
  createOrder,
  processOrder
}
