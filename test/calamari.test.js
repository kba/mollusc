const tap = require('tap')

tap.test('_parseLine', t => {
  t.plan(2)
  const engine = require('@ocrd/mollusc-backend').engines.calamari
  engine.prototype.session = {config: {cwd: '/home/foo/bar'}}
  t.deepEquals(engine.prototype._parseLine('#00007200: loss=0.25860454 ler=0.00106387 dt=0.32258639s'), ['addEpoch', {
    iteration: 7200,
    accuracy: -1,
    error: 0.00106387,
    chars: -1,
  }])

  t.deepEquals(engine.prototype._parseLine("Storing checkpoint to '/home/foo/bar/model_00007240.ckpt'"), ['addCheckpoint', '/home/foo/bar/model_00007240.ckpt'])
})

