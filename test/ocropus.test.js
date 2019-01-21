const tap = require('tap')


tap.test('_parseLine', t => {
  t.plan(2)
  const engine = require('@ocrd/mollusc-backend').engines.ocropus
  engine.prototype.session = {config: {cwd: '/home/foo/bar'}}
  t.deepEquals(engine.prototype._parseLine('69 107.10 (922, 48) /home/foo/bar'), ['addEpoch', {
    iteration: 69,
    error: 107.10,
    chars: -1,
    accuracy: -1
  }])

  t.deepEquals(engine.prototype._parseLine('# saving model-50.pyrnn.gz'), ['addCheckpoint', '/home/foo/bar/model-50.pyrnn.gz'])
})

