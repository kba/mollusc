const tap = require('tap')
const glob = require('glob')

const EngineManager = require('../src/engine-manager')

tap.test('engine-manager', t => {

  t.test('register / get / listEngines', t => {

    const mgr = new EngineManager()
    const engineClass = require('../src/engine/kraken')
    t.equals(engineClass.name, 'kraken/ketos', 'engineClass.name')
    mgr.registerEngine(engineClass)
    t.equals(mgr.getEngine(engineClass.name), engineClass, 'find by name')
    t.equals(mgr.getEngine(engineClass.name, engineClass.version), engineClass, 'find by name and version')
    t.deepEquals(mgr.listEngines(), [[engineClass.name, engineClass.version]], 'listEngines')

    t.end()
  })

  t.test('start session', t => {
    const mgr = new EngineManager()
    const engineClass = require('../src/engine/kraken')
    mgr.registerEngine(engineClass)
    const sessionConfig = {
      engineName: engineClass.name,
      engineVersion: engineClass.version,
      engineArguments: [
        // '--help',
        ...glob.sync('ocrd-testset/fied*.tif')
      ],
    }
    const engine = mgr.createSession(sessionConfig)
    engine.on('STOPPED', () => {
      console.log(engine.session)
      t.end()
    })
    engine.on('STARTED', () => {
      // setTimeout(() => engine.stop(), 2000)
      // engine.pause()
      // console.log(engine.session)
      // engine.resume()
      console.log(engine.session)
      // console.log({session})
    })
    engine.start()

  })

  t.end()
})
