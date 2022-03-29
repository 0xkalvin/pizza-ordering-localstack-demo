const service = require('../../../services/order')

async function create (request, response, next) {
  try {
    const customerId = request.headers['x-customer-id']

    const {
      items,
      payment_method: paymentMethod,
      total_price: totalPrice
    } = request.body

    const order = await service.createOrder({
      customerId,
      items,
      paymentMethod,
      totalPrice
    })

    return response.status(201).json(order)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  create
}
