const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const log = require('@ocrd/mollusc-shared').createLogger('server')
const {EngineManager, engines} = require('@ocrd/mollusc-backend')

module.exports = class MolluscServer {

  constructor() {
    this.engineManager = new EngineManager()
    this.engineManager.registerEngine(engines.kraken)
    this.engineManager.registerEngine(engines.calamari)

    const app = this.app = express()

    // logging middleware
    app.use(morgan('dev', {stream: {
      write(msg) {
        log.info(msg.trim())
      }
    }}))

    // JSON body parser
    app.use(bodyParser.json())
  }

  setupRoutes() {
    const {app, engineManager} = this

    app.get('/debug', (req, resp) => {
      resp.send(engineManager)
    })

    app.post('/session', (req, resp) => {
      resp.send(req.body)
    })

    app.get('/session', (req, resp) => {
      resp.send(engineManager.listSessions())
    })

  }

  start(PORT) {
    this.setupRoutes()
    this.app.listen(PORT, () => {
      log.info(`Server started at http://localhost:${PORT}`)
    })
  }

}

