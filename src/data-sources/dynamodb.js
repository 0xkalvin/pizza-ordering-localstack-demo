const { DynamoDB } = require('aws-sdk')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

const logger = require('../utils/logger')('DYNAMODB')

const {
  DYNAMODB_ENDPOINT,
  DYNAMODB_REGION,
  DYNAMODB_PIZZA_ORDERING_TABLE
} = process.env

const dynamodb = new DynamoDB({
  endpoint: DYNAMODB_ENDPOINT,
  region: DYNAMODB_REGION
})

async function createOrder (order) {
  try {
    const {
      customerId,
      items,
      id,
      paymentMethod,
      signature,
      status,
      totalPrice
    } = order

    const result = await dynamodb.putItem({
      TableName: DYNAMODB_PIZZA_ORDERING_TABLE,
      Item: marshall({
        pk: id,
        sk: 'ORDER',

        customer_id: customerId,
        items,
        payment_method: paymentMethod,
        signature,
        status,
        total_price: totalPrice
      })

    }).promise()

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to create order on DynamoDB',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

async function ping () {
  try {
    const result = await dynamodb.describeTable({
      TableName: DYNAMODB_PIZZA_ORDERING_TABLE
    }).promise()

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to ping DynamoDB',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

async function getAvailablePizzaToppings(){
  try {
    const { Items } = await dynamodb.query({
      TableName: DYNAMODB_PIZZA_ORDERING_TABLE,
      IndexName: 'sk_index',
      KeyConditionExpression: 'sk = :1',
      ExpressionAttributeValues: marshall({
        ':1': 'PIZZA',
      }),
    }).promise()

    const pizzas = new Set()

    if (Items && Items.length > 0) {
      Items.forEach((item) => {
        const { pk } = unmarshall(item);

        pizzas.add(pk)
      });
    }

    return pizzas;
  } catch (error) {
    logger.error({
      message: 'Failed to get pizza toppings from DynamoDB',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

module.exports = {
  createOrder,
  getAvailablePizzaToppings,
  ping
}
