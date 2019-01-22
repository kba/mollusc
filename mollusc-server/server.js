const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const {corsMiddleware} = require('@kba/node-utils')

const log = require('@ocrd/mollusc-shared').createLogger('server')
const {EngineManager, engines} = require('@ocrd/mollusc-backend')

module.exports = class MolluscServer {

  constructor() {
    // JSON/TSON/YAML parsing middleware
    const trafMiddleware = require('./middleware/traf-middleware')

    // File Upload middleware
    const uploadMiddleware = fileUpload({
      // 50 MB max
      limits: {fileSize: 50 * 1024 * 1024},
    })

    // CORS middleware
    Object.assign(this, {
      trafMiddleware,
      uploadMiddleware,
      log,
    })
  }

  start({port, host, baseUrl, dataDir}) {
    const engineManager = this.engineManager = new EngineManager({baseUrl, dataDir})
    ;[
      'tesseract',
      'kraken',
      'ocropus',
      'calamari'
    ].forEach(engine => {
      try {
        engineManager.registerEngine(engines[engine])
      } catch (err) {
        log.error(`Could not instantiate engine ${engine}: ${JSON.stringify(err)}`)
      }
    })

    // Restore all sessions
    engineManager.restoreAllSessions()

    const app = express()

    app.use(corsMiddleware())

    // request logging middleware
    app.use(morgan('dev', {
      stream: {
        write(msg) {
          log.info(msg.trim())
        }
      }
    }))

    Object.assign(this, {
      port,
      host,
      baseUrl,
      dataDir
    })

    app.get('/debug', (req, resp) => {
      resp.send(engineManager)
    })

    log.info("Setting up /session")
    app.use('/session', require('./routes/session')(this))

    log.info("Setting up /gt")
    app.use('/gt', require('./routes/gt')(this))

    log.info("Setting up /engine")
    app.use('/engine', require('./routes/engine')(this))

    app.listen(port, () => {
      log.info(`Server started at ${baseUrl}`)
    })
  }

}

