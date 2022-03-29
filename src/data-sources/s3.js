const { S3 } = require('aws-sdk')

const logger = require('../utils/logger')('S3')

const {
  NODE_ENV,
  S3_ENDPOINT,
  S3_REGION,
  S3_EVENT_BUCKET_NAME,
} = process.env

const s3 = new S3({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  s3ForcePathStyle: NODE_ENV === 'development' ? true : null
})

async function ping () {
  try {
    const result = await Promise.all([
      s3.headBucket({
        Bucket: S3_EVENT_BUCKET_NAME
      }).promise()
    ])

    return result
  } catch (error) {
    logger.error({
      message: 'Failed to ping s3',
      error_message: error.message,
      error_stack: error.stack
    })

    throw error
  }
}

module.exports = {
  ping
}
