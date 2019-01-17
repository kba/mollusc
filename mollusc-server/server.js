const express = require('express')
const morgan = require('morgan')

const log = require('@ocrd/mollusc-shared').createLogger('server')
const {EngineManager, engines} = require('@ocrd/mollusc-backend')

module.exports = class MolluscServer {

  constructor() {
    const engineManager = this.engineManager = new EngineManager()
    // for (let name in engines) {
    //   engineManager.registerEngine(engines[name])
    // }
    engineManager.registerEngine(engines.kraken)

    const app = this.app = express()

    // logging middleware
    app.use(morgan('dev', {stream: {
      write(msg) {
        log.info(msg.trim())
      }
    }}))

  }

  start({port, host, baseUrl}) {
    this.setupRoutes(baseUrl)
    this.app.listen(port, () => {
      log.info(`Server started at ${baseUrl}`)
    })
  }

  setupRoutes(baseUrl) {
    const {app, engineManager} = this

    const trafMiddleware = require('./middleware/traf-middleware')

    app.get('/debug', (req, resp) => {
      resp.send(engineManager)
    })

    app.get('/session/:id', (req, resp) => {
      const id = parseInt(req.params.id)
      const instance = engineManager.getInstanceById(id)
      if (!instance) {
        resp.status(404)
        return resp.send("No such session")
      }
      const {session} = instance
      resp.set('Content-Type', 'application/json')
      resp.set('Location', `${baseUrl}/session/${session.id}`)
      resp.send(session)
    })

    app.post('/session', trafMiddleware, (req, resp) => {
      try {
        const {session} = engineManager.createSession(req.body)
        resp.set('Content-Type', 'application/json')
        resp.set('Location', `${baseUrl}/session/${session.id}`)
        resp.send(session)
      } catch (error) {
        log.warn(error)
        resp.status(400)
        resp.send({message: "Invalid config", error})
      }
    })

    app.get('/session', (req, resp) => {
      resp.send(engineManager.listSessions())
    })

  }

}

