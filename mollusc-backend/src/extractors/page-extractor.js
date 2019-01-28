const xpath = require('xpath')
const {DOMParser} = require('xmldom')
const BaseExtractor = require('./base')

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
    const xmlstr = await this._resolveToString(url)
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
      mnemonic: url
        .replace(/^.*\//, '')
        .replace(/[^a-z0-9]/gi, ''),
      ...docMetadata,
      imageFilename,
      textLines,
    }
  }

}
