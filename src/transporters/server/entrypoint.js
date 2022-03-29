const http = require('http')

const application = require('./application')
const {
  dynamodb,
  firehose,
  s3,
  sqs,
  ssm
} = require('../../data-sources')
const logger = require('../../utils/logger')('SERVER')

const {
  PORT
} = process.env

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

  const server = http.createServer(application)

  server.listen(PORT, () => {
    logger.info({
      message: 'Server is up and kicking',
      port: PORT
    })
  })
}

run()
