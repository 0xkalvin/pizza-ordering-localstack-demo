const express = require('express')
const helmet = require('helmet')

const orderController = require('./controllers/order')

const application = express()

application.use(helmet())
application.use(express.json())

application.post('/orders', orderController.create)

application.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  const data = {
    error_message: error.message || 'Something went wrong, please try again',
    method: request.method,
    url: request.url
  }

  return response
    .status(statusCode)
    .json(data)
})

module.exports = application
