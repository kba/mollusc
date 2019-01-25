const xpath = require('xpath')
const {DOMParser} = require('xmldom')
const {idiomaticFetch, fetch} = require('@kba/node-utils')
const HttpsProxyAgent = require('https-proxy-agent')
Object.assign(idiomaticFetch, {fetch})

const fetchOptions = {redirect: 'follow'}
if (process.env.HTTP_PROXY) {
  Object.assign(fetchOptions, {agent: new HttpsProxyAgent(process.env.HTTP_PROXY)})
}

class PageImporter {

  constructor() {
    this.parser = new DOMParser()
    this.select = xpath.useNamespaces({'pg': 'http://schema.primaresearch.org/PAGE/gts/pagecontent/2018-07-15'})
  }

  async resolveUrlToFile(url) {
    // if (!(url.match(/^https?:\/\//))) {
    //   return url
    // }
    return idiomaticFetch(url, fetchOptions, 'arrayBuffer')
  }

  extract(xmlstr) {
    const {parser, select} = this
    const xmldoc = parser.parseFromString(xmlstr)
    const imageFilename = select('/pg:PcGts/pg:Page/@imageFilename', xmldoc, true).nodeValue
    const textLines = select("//pg:TextLine", xmldoc).map(textLine => {
      const transcription = select('./pg:TextEquiv/pg:Unicode/text()', textLine, true).nodeValue
      const coords = select('./pg:Coords/@points', textLine, true).nodeValue.split(' ').map(xy => xy.split(',').map(s => parseInt(s)))
      const id = select('@id', textLine, true).nodeValue
      return {
        id,
        coords,
        transcription
      }
    })
    return {
      imageFilename,
      textLines,
    }
  }

}
module.exports = PageImporter

;(async function() {
  const fs = require('fs')
  const FILE = '/data/monorepo/assets/data/kant_aufklaerung_1784-page-block-line-word/data/OCR-D-GT-SEG-WORD/OCR-D-GT-SEG-WORD_0001'
  const FILEDATA = fs.readFileSync(FILE, {encoding: 'utf8'})
  const importer = new PageImporter()
  const extracted = importer.extract(FILEDATA)
  console.log(extracted)
  console.log(extracted.imageFilename)
  const resp = await importer.resolveUrlToFile(extracted.imageFilename)
  console.log(Buffer.from(resp.bodyData))
})()
// console.log(extracted.textLines[0])

