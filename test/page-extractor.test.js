const tap = require('tap')

const {PageExtractor} = require('@ocrd/mollusc-backend').extractors
const asset = p => `${__dirname}/assets/${p}`
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const {join} = require('path')
const os = require('os')
let TEMP_FOLDER = join(os.tmpdir(), 'page-extractor-test')

tap.test('page-extractor', t => {

  t.plan(1)

  t.beforeEach(done => {
    rimraf.sync(TEMP_FOLDER)
    mkdirp.sync(TEMP_FOLDER)
    done()
  })

  t.tearDown(done => {
    rimraf.sync(TEMP_FOLDER)
  })

  t.test('extract', async t => {

    t.plan(1)

    const extractor = new PageExtractor()
    const parsed = await extractor.parse(asset('kant_aufklaerung_1784-page-block-line-word/data/OCR-D-GT-SEG-WORD/OCR-D-GT-SEG-WORD_0001'))
    t.equals(parsed.textLines.length, 24, '24 lines')
    await extractor.extract(parsed, {
      outputDir: TEMP_FOLDER,
      imgExtension: '.png',
      txtExtension: '.gt.txt'
    })
    // console.log(extracted)
    // console.log(extracted.imageFilename)
    // const resp = await importer.resolveUrlToFile(extracted.imageFilename)
    // console.log(Buffer.from(resp.bodyData))
  })
})
