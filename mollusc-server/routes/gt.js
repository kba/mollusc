const {Router} = require('express')
const {join} = require('path')
const {createReadStream} = require('fs')

module.exports = function gtRoute(server) {
  const {dataDir, baseUrl, uploadMiddleware, log} = server
  const app = new Router()

  app.post('/', uploadMiddleware, (req, resp) => {
    if (!('gt' in req.files)) {
      return resp.status(400).send('No file "gt" was sent.')
    }
    const gtFile = req.files.gt
    if (gtFile.mimetype !== 'application/zip') {
      return resp.status(400).send('File "gt" must be "application/zip".')
    }

    const basename = `${gtFile.md5()}.zip`
    const fpath = join(dataDir, 'gt', basename)
    log.info(`Saving GT file to ${fpath}`, gtFile)
    gtFile.mv(fpath, err => {
      if (err)
        return resp.status(500).send(err)

      resp.set('Location', `${baseUrl}/gt/${basename}`)
      resp.send('File uploaded!')
    })
  })

  app.get('/:basename', (req, resp) => {
    const {basename} = req.params
    const fpath = join(dataDir, 'gt', basename)
    const fstream = createReadStream(fpath)
    resp.set('Content-Type', 'application/zip')
    fstream.pipe(resp)
  })

  return app

}
