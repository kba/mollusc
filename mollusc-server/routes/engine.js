const {Router} = require('express')

module.exports = function engineRoute(server) {
  const {engineManager, log} = server
  const app = new Router()

  app.get('/', (req, resp) => {
    return resp.send(engineManager.listEngines())
  })

  app.get('/:engineName', (req, resp) => {
    const {engineName} = req.params
    const engine = engineManager.getEngine(engineName)
    return resp.send({engineName, engineVersion: engine.version})
  })

  return app
}
