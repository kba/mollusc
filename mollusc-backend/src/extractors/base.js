const {access, readFile} = require('fs')
const {idiomaticFetch} = require('@kba/node-utils')
const {sprintf} = require('sprintf-js')
const {join} = require('path')

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
  async extract(doc, opts) {
    if (!('outputDir'    in opts)) throw new Error("outputDir required")
    if (!('imgExtension' in opts)) throw new Error("imgExtension required")
    if (!('txtExtension' in opts)) throw new Error("txtExtension required")
    const {outputDir, imgExtension, txtExtension} = opts

    const {mnemonic, imageFilename, textLines} = doc
    textLines.forEach((textLine, idx) => {
      const basename_without_extension = sprintf('%s_%04u', mnemonic, idx+1)
      const imgFname = join(outputDir, basename_without_extension +  imgExtension)
      const txtFname = join(outputDir, basename_without_extension +  txtExtension)
      console.log({imgFname, txtFname})
    })
  }


  async _resolveToString(url) {
    const buf = await this._resolveToBuffer(url)
    return buf.toString('utf8')
  }

  async _resolveToBuffer(url) {
    if (!(url.match(/^https?:\/\//))) {
      return new Promise((resolve, reject) => {
        access(url, err => {
          if (err)
            return resolve(url)
          readFile(url, (err, buf) => {
            return err ? reject(err) : resolve(buf)
          })
        })
      })
    }
    return idiomaticFetch(url, 'arrayBuffer').then(ab => Buffer.from(ab))
  }

}
