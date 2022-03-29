const { SSM } = require('aws-sdk')

const logger = require('../utils/logger')('SSM')

const {
  SSM_ENDPOINT,
  SSM_REGION,
  SSM_APP_SECRET_KEY
} = process.env

const ssm = new SSM({
  endpoint: SSM_ENDPOINT,
  region: SSM_REGION
})

let cachedSecretKey = null

async function ping () {
  try {
    const result = await ssm.describeParameters({
      MaxResults: 1
    }).promise()

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to ping SSM',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

async function getAppSecretKey () {
  if (cachedSecretKey){
    return cachedSecretKey
  }
  try {
    const result = await ssm.getParameter({
      Name: SSM_APP_SECRET_KEY
    }).promise()

    cachedSecretKey = result.Parameter.Value

    return cachedSecretKey
  } catch (error) {
    logger.error({
      message: 'Failed to get app secret key on SSM',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

module.exports = {
  getAppSecretKey,
  ping
}
