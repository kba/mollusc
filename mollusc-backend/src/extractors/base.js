const {readFile} = require('fs')
const {idiomaticFetch} = require('@kba/node-utils')

module.exports =
class BaseExtractor {

  /**
   * Parse the thing to extract images from and return possible selectors
   */
  async parse(url) {
    throw new Error('parse must be implemented')
  }

  /**
   *
   *  Extract lines matching selector
   */
  async extract(url, selector='*') {
    throw new Error('extract must be implemented')
  }

  async _resolveToBuffer(url) {
    if (!(url.match(/^https?:\/\//))) {
      return new Promise((resolve, reject) => {
        readFile(url, (err, buf) => {
          return err ? reject(err) : resolve(buf)
        })
      })
    }
    return idiomaticFetch(url, 'arrayBuffer').then(ab => Buffer.from(ab))
  }

}
