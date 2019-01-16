const express = require('express')
const {EngineManager, engines} = require('@ocrd/mollusc-backend')
const log = require('@ocrd/mollusc-shared').createLogger('server')

const engineManager = new EngineManager()
engineManager.registerEngine(engines.KrakenEngine)

module.exports = class MolluscServer {

  constructor() {
    this.app = express()

  }

  setupRoutes() {
    const {app} = this

    app.get('/debug', (req, resp) => {
      resp.send(engineManager)
    })
  }

  start(PORT) {
    this.app.listen(PORT, () => {
      log.info(`Server started at http://localhost:${PORT}`)
    })
  }

}

