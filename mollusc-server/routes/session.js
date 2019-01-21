const {Router} = require('express')

module.exports = function gtRoute(server) {
  const {engineManager, baseUrl, trafMiddleware, log} = server
  const app = new Router()

  function sessionMiddleware(req, resp, next) {
    const id = req.params.id
    const instance = (id === 'latest')
      ? engineManager.listInstances().pop()
      : engineManager.getInstanceById(id)
    if (!instance)
      return resp.status(404).send("No such session")
    const {session} = instance
    Object.assign(req, {session, instance})
    next()
  }

  function sendSession(req, resp) {
    const {session} = req
    resp.set('Content-Type', 'application/json')
    resp.set('Location', `${baseUrl}/session/${session.id}`)
    resp.send(session)
  }

  app.get('/:id', sessionMiddleware, (req, resp) => {
    return sendSession(req, resp)
  })

  app.post('/:id/save', sessionMiddleware, (req, resp) => {
    const {instance} = req
    instance._saveSession()
  })

  app.put('/:id/:command(start|pause|resume|stop)', sessionMiddleware, (req, resp) => {
    const {command} = req.params
    log.debug(`Running ${command}() on session ${req.params.id}`)
    req.instance[command]()
    return sendSession(req, resp)
  })

  app.post('/', trafMiddleware, (req, resp) => {
    try {
      const {id, session} = engineManager.createSession(req.body)
      resp.set('Content-Type', 'application/json')
      resp.set('Location', `${baseUrl}/session/${id}`)
      resp.send(session)
    } catch (error) {
      log.warn(error)
      resp.status(400)
      resp.send({message: "Invalid config", error})
    }
  })

  app.get('/', (req, resp) => {
    const sessions = engineManager.listInstances().map(instance => instance.session)
    if (req.query.full == '1') {
      resp.send(sessions)
    } else  {
      resp.send(sessions.map(session => `${baseUrl}/session/${session.id}`))
    }
  })


  return app
}
