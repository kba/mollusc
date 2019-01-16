const getSchema = require('./schemas')
const log = require('@ocrd/mollusc-shared').createLogger('engine-manager')

module.exports = class EngineManager {

  constructor() {
    this._engines = []
    this._queue = []
  }

  registerEngine(engineClass) {
    // check for version to make sure there is one and not an exception
    const {name, version} = engineClass
    if (!(this._engines.includes(engineClass))) {
      log.info(`Registering engine ${name}, version ${version}`)
      this._engines.push(engineClass)
    }
  }

  getEngine(engineName, engineVersion=null) {
    return this._engines.find(engine => engine.name === engineName && (engineVersion===null || engineVersion === engine.version))
  }

  listEngines() {
    return this._engines.map(engine => {return [engine.name, engine.version]})
  }

  /**
   * ### startSession
   *
   * - `@param sessionConfig` Training description conforming to training-session json-schema
   *
   */
  createSession(sessionConfig) {

    // Validate general schema correctness
    getSchema('training')(sessionConfig)

    // Make sure engine is registered
    const {engineName, engineVersion} = sessionConfig
    const engineClass = this.getEngine(engineName, engineVersion)
    if (!engineClass)
      throw new Error(`No such engine "${engineName}_${engineVersion}". Available: ${this.listEngines().map(t => t.join(' '))}`)

    // Validate the engine is happy about the config
    engineClass.validateSessionConfig(sessionConfig)

    // Create a new engine instance
    const engine = new engineClass(sessionConfig)
    this._queue.push(engine)

    // TODO add event handlers

    return engine
  }

  listSessions() {
    return this._queue
  }

}
