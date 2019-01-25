const tap = require('tap')

const {readFileSync} = require('fs')
const {PageExtractor} = require('@ocrd/mollusc-backend').extractors
const asset = p => `${__dirname}/assets/${p}`

tap.test('page-extractor', async t => {

  t.plan(1)

  const FILEDATA = readFileSync(
    asset('kant_aufklaerung_1784-page-block-line-word/data/OCR-D-GT-SEG-WORD/OCR-D-GT-SEG-WORD_0001'),
    {encoding: 'utf8'})
  const importer = new PageExtractor()
  const extracted = await importer.extract(FILEDATA)
  t.equals(extracted.textLines.length, 24, '24 lines')
  // console.log(extracted)
  // console.log(extracted.imageFilename)
  // const resp = await importer.resolveUrlToFile(extracted.imageFilename)
  // console.log(Buffer.from(resp.bodyData))
})
