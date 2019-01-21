const getSchema = require('./schemas')
const {join} = require('path')
const log = require('@ocrd/mollusc-shared').createLogger('engine-manager')
const mkdirp = require('mkdirp')

module.exports = class EngineManager {

  constructor({baseUrl, dataDir}) {
    this._engines = []
    this._queue = []
    this.dataDir = dataDir
    this.baseUrl = baseUrl
  }

  registerEngine(engineClass) {
    // check for version to make sure there is one and not an exception
    const {name, version} = engineClass
    if (!(this._engines.includes(engineClass))) {
      log.info(`Registering engine ${name}\tv${version}`)
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

    // Validate general schema correctness and add default values
    getSchema('training')(sessionConfig)

    // Make sure engine is registered
    const {engineName, engineVersion} = sessionConfig
    const engineClass = this.getEngine(engineName, engineVersion)
    if (!engineClass)
      throw new Error(`No such engine "${engineName}_${engineVersion}". Available: ${this.listEngines().map(t => t.join(' '))}`)

    // Validate the engine is happy about the config
    engineClass.validateSessionConfig(sessionConfig)

    // create working directory
    // TODO less hacky the files to session.cwd
    const sessionId = `${engineName}-${Date.now()}`
    const cwd = join(this.dataDir, 'sessions', sessionId)
    mkdirp.sync(cwd)
    sessionConfig.cwd = cwd

    // Replace baseUrl with dataDir in groundTruthBag
    sessionConfig.groundTruthBag = sessionConfig.groundTruthBag
      .replace(this.baseUrl + '/', this.dataDir)
    log.warn(sessionConfig)

    // Create a new engine instance
    const instance = new engineClass(sessionId, sessionConfig)
    this._queue.push(instance)

    // Attach error handler
    instance.on('ERROR', (exitCode, error) => {
      Object.assign(instance.session, {
        exitCode,
        error
      })
    })

    // TODO other event handlers

    return instance
  }

  listInstances() {
    return [...this._queue]
  }

  getInstanceById(idOrSession) {
    if (typeof idOrSession !== 'string') {
      idOrSession = idOrSession.id
    }
    return this._queue.find(instance => instance.id = idOrSession)
  }

}
