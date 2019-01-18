const {Router} = require('express')

module.exports = function gtRoute(server) {
  const {engineManager, baseUrl, trafMiddleware, log} = server
  const app = new Router()

  function sessionMiddleware(req, resp, next) {
    const id = parseInt(req.params.id)
    const instance = engineManager.getInstanceById(id)
    if (!instance) {
      resp.status(404)
      return resp.send("No such session")
    }
    const {session} = instance
    Object.assign(req, {session, instance})
    next()
  }

  function sendSession(resp, session) {
    resp.set('Content-Type', 'application/json')
    resp.set('Location', `${baseUrl}/session/${session.id}`)
    resp.send(session)
  }

  app.get('/:id', sessionMiddleware, (req, resp) => {
    return sendSession(resp, req.session)
  })

  app.put('/:id/:command(start|pause|resume|stop)', sessionMiddleware, (req, resp) => {
    const {command} = req.params
    log.debug(`Running ${command}() on session ${req.params.id}`)
    req.instance[command]()
    return sendSession(resp, req.session)
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
    resp.send(engineManager.listInstances().map(instance => instance.session))
  })

  return app
}
