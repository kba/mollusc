const {Router} = require('express')
const {join} = require('path')
const {readdir, createReadStream} = require('fs')
const mkdirp = require('mkdirp')

module.exports = function gtRoute(server) {
  const {dataDir, baseUrl, uploadMiddleware, log} = server
  const app = new Router()
  const gtDir = join(dataDir, 'gt')

  app.post('/', uploadMiddleware, (req, resp) => {
    if (!('gt' in req.files)) {
      return resp.status(400).send('No file "gt" was sent.')
    }
    const gtFile = req.files.gt
    if (gtFile.mimetype !== 'application/zip') {
      return resp.status(400).send('File "gt" must be "application/zip".')
    }

    const basename = `${gtFile.md5()}.zip`
    const fpath = join(gtDir, basename)
    log.info(`Saving GT file to ${fpath}`, gtFile)
    mkdirp.sync(gtDir)
    gtFile.mv(fpath, err => {
      if (err)
        return resp.status(500).send(err)

      resp.set('Location', `${baseUrl}/gt/${basename}`)
      resp.send('File uploaded!')
    })
  })

  app.get('/:basename', (req, resp) => {
    const {basename} = req.params
    const fpath = join(gtDir, basename)
    const fstream = createReadStream(fpath)
    resp.set('Content-Type', 'application/zip')
    fstream.pipe(resp)
  })

  app.get('/', (req, resp) => {
    readdir(join(dataDir,  'gt'), (err, entries) => {
      if (err) {
        return resp.status(500).send(err)
      }
      resp.send(entries.map(e => `${baseUrl}/gt/${e}`))
    })
  })

  return app

}
