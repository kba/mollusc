/**
 * Middleware parsing whatever traf supports
 */
const log = require('@ocrd/mollusc-shared').createLogger('traf-middleware')
const {TRAF} = require('traf')
const bodyParser = require('body-parser')

// text body parser
const textBodyParser = bodyParser.text({type: () => true})
module.exports = function trafMiddleware(req, resp, next) {
  textBodyParser(req, resp, () => {
    const body = req.body
    if (!body) return next()

    const contentType = req.headers['content-type']
    if (!contentType) return next()

    const format = TRAF.guessMimetypeFormat(contentType)
    if (!format) return next()

    log.debug({contentType, format, body})
    TRAF.parseAsync(body, {format}, (err, parsed) => {
      if (err) return next(err)
      log.debug({parsed})
      req.body = parsed
      next()
    })
  })
}
