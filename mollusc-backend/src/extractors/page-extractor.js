const xpath = require('xpath')
const {DOMParser} = require('xmldom')
const BaseExtractor = require('./base')

const log = require('@ocrd/mollusc-shared').createLogger('page-extractor')

module.exports =
class PageLineExtractor extends BaseExtractor {

  constructor(...args) {
    super(...args)
    this.parser = new DOMParser()
    this.select = xpath.useNamespaces({'pg': 'http://schema.primaresearch.org/PAGE/gts/pagecontent/2018-07-15'})
  }

  /** @override */
  async parse(url, docMetadata) {
    const {parser, select} = this
    log.debug(`Parsing PAGE XML: ${url}`)
    const xmlstr = await this._resolveToString(url)
    const xmldoc = parser.parseFromString(xmlstr)
    const imageUrl = select('/pg:PcGts/pg:Page/@imageFilename', xmldoc, true).nodeValue
    const textLines = select("//pg:TextLine", xmldoc).map(textLine => {
      const transcription = select('./pg:TextEquiv/pg:Unicode/text()', textLine, true).nodeValue
      const coords = select('./pg:Coords/@points', textLine, true).nodeValue.split(' ').map(xy => xy.split(',').map(s => parseInt(s)))
      const lineId = select('@id', textLine, true).nodeValue
      return {
        lineId,
        coords,
        transcription
      }
    })
    return {
      mnemonic: url
        .replace(/^.*\//, '')
        .replace(/[^a-z0-9]/gi, ''),
      imageUrl,
      pageUrl: url,
      textLines,
      ...docMetadata,
    }
  }

}
