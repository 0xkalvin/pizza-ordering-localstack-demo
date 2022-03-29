const pino = require('pino')

const {
  LOG_LEVEL,
  NODE_ENV
} = process.env

module.exports = (name) => pino({
  name,
  level: LOG_LEVEL,
  nestedKey: 'data',
  formatters: {
    level: (label) => ({ level: label })
  },
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin () {
    return {
      env: NODE_ENV
    }
  }
})
