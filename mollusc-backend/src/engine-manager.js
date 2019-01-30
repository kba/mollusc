const {join} = require('path')
const mkdirp = require('mkdirp')
const {readdir, readFileSync} = require('fs')

const getSchema = require('./schemas')
const Session = require('./session')
const {STOPPED, ERROR} = require('./session/states')

const log = require('@ocrd/mollusc-shared').createLogger('engine-manager')

module.exports = class EngineManager {

  constructor({baseUrl, dataDir}={}) {
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

  restoreAllSessions() {
    readdir(join(this.dataDir, 'sessions'), (err, sessionIds) => {
      if (err)
        return
      sessionIds.forEach(sessionId => this.restoreSession(sessionId))
    })
  }

  restoreSession(sessionId) {
    const sessionFile = join(this.dataDir, 'sessions', sessionId, 'session.json')
    log.info(`Restoring session ${sessionId} from ${sessionFile}`)
    let sessionJson
    try {
      sessionJson = JSON.parse(readFileSync(sessionFile))

      // Validate general schema correctness and add default values
      getSchema('training')(sessionJson.config)

      // Make sure engine is registered
      const {engineName, engineVersion} = sessionJson.config
      const engineClass = this.getEngine(engineName, engineVersion)
      if (!engineClass)
        throw new Error(`No such engine "${engineName}_${engineVersion}". Available: ${this.listEngines().map(t => t.join(' '))}`)

      // Validate the engine is happy about the config
      engineClass.validateSessionConfig(sessionJson.config)


      // Mark as stoppped unless STOPPED or ERROR (these aren't running processes!)
      if (sessionJson.state !== STOPPED && sessionJson.state !== ERROR) {
        sessionJson.state = STOPPED
      }
      const instance = new engineClass(sessionId, new Session(sessionJson))

      this.addInstance(instance)
      return instance

    } catch (err) {
      log.error(`Failed to restore Session ${sessionFile}: ${err}`)
      console.log(err)
    }
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
    sessionConfig.groundTruthBag = sessionConfig.groundTruthBag.replace(this.baseUrl + '/', this.dataDir)
    log.warn(sessionConfig)

    // Create a new engine instance
    const instance = new engineClass(sessionId, sessionConfig)
    this.addInstance(instance)

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
    return this._queue.find(instance => instance.id === idOrSession)
  }

  addInstance(instance) {
    this._queue.push(instance)
  }

}
