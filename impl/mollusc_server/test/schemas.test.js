const tap = require('tap')
const validate = require('../src/schemas')

tap.test('schemas', t => {

  t.test('training', t => {
    validate('training')({
    })
    t.end()
  })

  t.end()
})

