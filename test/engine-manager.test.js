const tap = require('tap')
const glob = require('glob')

const {EngineManager} = require('@ocrd/mollusc-backend')
const engineClass = require('@ocrd/mollusc-backend').engines.kraken

tap.test('engine-manager', t => {

  t.test('register / get / listEngines', t => {

    const mgr = new EngineManager()
    t.equals(engineClass.name, 'kraken', 'engineClass.name')
    mgr.registerEngine(engineClass)
    t.equals(mgr.getEngine(engineClass.name), engineClass, 'find by name')
    t.equals(mgr.getEngine(engineClass.name, engineClass.version), engineClass, 'find by name and version')
    t.deepEquals(mgr.listEngines(), [[engineClass.name, engineClass.version]], 'listEngines')

    t.end()
  })

  // t.test('start session', t => {
  //   const mgr = new EngineManager()
  //   mgr.registerEngine(engineClass)
  //   const sessionConfig = {
  //     engineName: engineClass.name,
  //     engineVersion: engineClass.version,
  //     engineArguments: [
  //       // '--help',
  //       ...glob.sync(`${__dirname}/assets/gt-bag-testset/data/ground-truth/f*.tif`)
  //     ],
  //   }
  //   const engine = mgr.createSession(sessionConfig)
  //   engine.on('ERROR', (...args) => {
  //     console.log('ERROR', ...args)
  //     t.end()
  //   })
  //   engine.on('STOPPED', () => {
  //     console.log(engine.session)
  //     t.end()
  //   })
  //   engine.on('STARTED', () => {
  //     // setTimeout(() => engine.stop(), 2000)
  //     // engine.pause()
  //     // console.log(engine.session)
  //     // engine.resume()
  //     console.log(engine.session)
  //     // console.log({session})
  //   })
  //   engine.start()

  // })

  t.end()
})
