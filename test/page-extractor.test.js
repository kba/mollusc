const t = require('tap')

const {PageExtractor} = require('@ocrd/mollusc-backend').extractors
const asset = p => `${__dirname}/assets/${p}`
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const {join} = require('path')
const os = require('os')
const fs = require('fs')
let TEMP_FOLDER = join(os.tmpdir(), 'page-extractor-test')

t.test('page-extractor', async t => {

  t.plan(1)

  t.beforeEach(done => {
    console.log(`beforeEach - creating empty dir ${TEMP_FOLDER}`)
    rimraf.sync(TEMP_FOLDER)
    mkdirp.sync(TEMP_FOLDER)
    done()
  })

  // t.tearDown(done => {
  //   console.log(`tearDown - deleting ${TEMP_FOLDER}`)
  //   rimraf.sync(TEMP_FOLDER)
  // })

  t.test('page-extractor: extract images', async t => {

    t.plan(3)

    const mnemonic = 'foobar'

    const extractor = new PageExtractor()
    const parsed = await extractor.parse(asset('kant_aufklaerung_1784-page-block-line-word/data/OCR-D-GT-SEG-WORD/OCR-D-GT-SEG-WORD_0001'))
    t.equals(parsed.textLines.length, 24, '24 lines')
    Object.assign(parsed, {mnemonic})
    const result = await extractor.extract(parsed, {
      outputDir: TEMP_FOLDER,
      imgExtension: '.png',
      txtExtension: '.gt.txt',
      jsonExtension: '.json',
    })
    const {size} = fs.statSync(join(TEMP_FOLDER, `${mnemonic}_0010.png`))
    t.equals(size, 83332, 'png size')
    const json = JSON.parse(fs.readFileSync(join(TEMP_FOLDER, `${mnemonic}_0010.json`)))
    t.equals(json.lineId, 'tl_9', 'lineId from JSON')
  })
})
