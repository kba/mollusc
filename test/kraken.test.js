const tap = require('tap')

tap.test('_parseLine', t => {
  t.plan(2)
  const engine = require('@ocrd/mollusc-backend').engines.kraken
  engine.prototype.session = {config: {cwd: '/home/foo/bar'}}
  t.deepEquals(engine.prototype._parseLine('Accuracy report (14) 0.0000 132 130)'), ['addEpoch', {
    iteration: 14,
    accuracy: 0,
    error: 130,
    chars: 132,
  }])

  t.deepEquals(engine.prototype._parseLine('Saving to model-50'), ['addCheckpoint', '/home/foo/bar/model-50.mlmodel'])
})

