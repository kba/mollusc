const express = require('express')
const {EngineManager, engines} = require('@ocrd/mollusc-backend')
const log = require('@ocrd/mollusc-shared').createLogger('server')

module.exports = class MolluscServer {

  constructor() {
    this.app = express()
    this.engineManager = new EngineManager()
    this.engineManager.registerEngine(engines.kraken)
    this.engineManager.registerEngine(engines.calamari)
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

