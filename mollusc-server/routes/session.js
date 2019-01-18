const {Router} = require('express')

module.exports = function gtRoute(server) {
  const {engineManager, baseUrl, trafMiddleware, log} = server
  const app = new Router()

  app.get('/:id', (req, resp) => {
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

  app.post('/', trafMiddleware, (req, resp) => {
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

  app.get('/', (req, resp) => {
    resp.send(engineManager.listSessions())
  })

  return app
}
