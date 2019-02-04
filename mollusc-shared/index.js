const {execFileSync} = require('child_process')
const mkdirp = require('mkdirp')
const logging = require('./src/logging')

function unzipTo(zippath, outpath) {
  mkdirp.sync(outpath)
  return execFileSync(`unzip`, [zippath], {
    cwd: outpath,
    encoding: 'utf8',
  })
}

module.exports = {
  ...logging,
  unzipTo
}
