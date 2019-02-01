const {createLogger, format, transports} = require('winston')
const consoleTransport = new transports.Console()

module.exports = {
  level: process.env.LOGLEVEL ? process.env.LOGLEVEL : 'silly',
  createLogger(name) {
    const conf = {
      level: module.exports.level,
      format: format.combine(
        format.colorize({
          all: true,
          colors: {
            debug: 'yellow',
            warn: 'red',
            error: 'bold red',
          }
        }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} [${info.level}] \x1b[35;1m${name}\x1b[0m: ${info.message}`)
      ),
      transports: [consoleTransport]
    }
    return createLogger(conf)
  }
}
