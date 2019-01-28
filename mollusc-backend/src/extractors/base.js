const {access, readFile} = require('fs')
const {idiomaticFetch} = require('@kba/node-utils')
const {sprintf} = require('sprintf-js')
const {join} = require('path')
const sharp = require('sharp')
const pLimit = require('p-limit')

const {promisify} = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)

const sortNumerical = (a, b) => a - b
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
    if (!('jsonExtension' in opts)) throw new Error("jsonExtension required")
    const {outputDir, imgExtension, txtExtension, jsonExtension} = opts

    const {
      mnemonic,
      bagUrl,
      pageUrl,
      imageUrl,
      textLines
    } = doc
    const imageBuffer = await this._resolveToBuffer(imageUrl)

    // Process ten lines in parallel
    const limit = pLimit(10)
    return Promise.all(textLines.map(({coords, transcription, lineId}, idx) => limit(() => {
      const basename_without_extension = sprintf('%s_%04u', mnemonic, idx+1)

      const imgFname = join(outputDir, basename_without_extension +  imgExtension)
      const txtFname = join(outputDir, basename_without_extension +  txtExtension)
      const jsonFname = join(outputDir, basename_without_extension +  jsonExtension)

      // sort coordinates
      const xSorted = coords.map(xy => xy[0]).sort(sortNumerical)
      const ySorted = coords.map(xy => xy[1]).sort(sortNumerical)
      const top = ySorted[0]
      const bottom = ySorted[ySorted.length - 1]
      const left = xSorted[0]
      const right = xSorted[xSorted.length - 1]
      const width = right - left
      const height = bottom - top

      // JSON metadata
      const jsonMetadata = {
        bagUrl,
        pageUrl,
        imageUrl,
        lineId,
        coords,
      }

      // console.log({ySorted, transcription, left, top, right, bottom, width, height})

      return sharp(imageBuffer)
        .extract({left, top, width, height})
        .toFile(imgFname)
        .then(() => writeFile(txtFname, transcription))
        .then(() => writeFile(jsonFname, JSON.stringify(jsonMetadata, null, 2)))
    })))
  }

  /* ==============================================================================
   *
   * PRIVATE API
   *
   *==============================================================================*/

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
    return idiomaticFetch(url,  'arrayBuffer').then(resp => {
      const {bodyData} = resp
      // console.log(bodyData)
      // console.log(Buffer.from(bodyData).toString('utf8'))
      return Buffer.from(bodyData)
    })
  }

}
