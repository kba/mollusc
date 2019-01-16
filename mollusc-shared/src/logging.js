const {createLogger, format, transports} = require('winston')
const consoleTransport = new transports.Console()

module.exports = {
  createLogger(name) {
    const conf = {
      level: 'silly',
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
        format.printf(info => `${info.timestamp} - [${info.level}] - ${name}: ${info.message}`)
      ),
      transports: [consoleTransport]
    }
    return createLogger(conf)
  }
}
