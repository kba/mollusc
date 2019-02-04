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
    this._trainingQueue = []
    this.dataDir = dataDir
    this.baseUrl = baseUrl
  }

  registerEngine(engineClass) {
    // check for version to make sure there is one and not an exception
    const {name, version} = engineClass
    if (!(this._engines.includes(engineClass))) {
      if (!engineClass.trainer) {
        log.error(`${engineClass.name} has no trainer`)
        throw new Error(`${engineClass.name} has no trainer`)
      }
      if (!engineClass.trainer.validateSessionConfig) {
        log.error(`${engineClass.name}.trainer has no validateSessionConfig`)
        throw new Error(`${engineClass.name}.trainer has no validateSessionConfig`)
      }
      if (!engineClass.recognizer) {
        log.error(`${engineClass.name} has no recognizer`)
        throw new Error(`${engineClass.name} has no recognizer`)
      }
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
    readdir(join(this.dataDir, 'sessions', 'training'), (err, sessionIds) => {
      if (err) return
      sessionIds.forEach(sessionId => this.restoreTrainingSession(sessionId))
    })
  }

  restoreTrainingSession(sessionId) {
    const sessionFile = join(this.dataDir, 'sessions', 'training', sessionId, 'session.json')
    log.info(`Restoring training session ${sessionId} from ${sessionFile}`)
    let sessionJson
    try {
      sessionJson = JSON.parse(readFileSync(sessionFile))

      // Validate general schema correctness and add default values
      getSchema('training')(sessionJson.config)

      // Make sure engine is registered
      const {engineName, engineVersion} = sessionJson.config
      const {trainer} = this.getEngine(engineName, engineVersion)
      if (!trainer)
        throw new Error(`No such trainer "${engineName} ${engineVersion}". Available: ${this.listEngines().map(t => t.join(' '))}`)

      // Validate the engine is happy about the config
      trainer.validateSessionConfig(sessionJson.config)

      // Mark as stoppped unless STOPPED or ERROR (these aren't running processes!)
      if (sessionJson.state !== STOPPED && sessionJson.state !== ERROR) {
        sessionJson.state = STOPPED
      }
      const trainingInstance = new trainer(sessionId, new Session(sessionJson))

      this.addTrainingInstance(trainingInstance)
      return trainingInstance

    } catch (err) {
      log.error(`Failed to restore Session ${sessionFile}: ${err}`)
      console.log(err)
    }
  }

  /**
   * ### createTrainingSession
   *
   * - `@param sessionConfig` Training description conforming to training-session json-schema
   *
   */
  createTrainingSession(sessionConfig) {

    // Validate general schema correctness and add default values
    getSchema('training')(sessionConfig)

    // Make sure engine is registered
    const {engineName, engineVersion} = sessionConfig
    const {trainer} = this.getEngine(engineName, engineVersion)
    if (!trainer)
      throw new Error(`No such engine "${engineName}_${engineVersion}". Available: ${this.listEngines().map(t => t.join(' '))}`)

    // Validate the engine is happy about the config
    trainer.validateSessionConfig(sessionConfig)

    // create working directory
    // TODO less hacky the files to session.cwd
    const sessionId = `${engineName}-${Date.now()}`
    const cwd = join(this.dataDir, 'sessions', 'training', sessionId)
    mkdirp.sync(cwd)
    sessionConfig.cwd = cwd

    // Replace baseUrl with dataDir in groundTruthBag
    sessionConfig.groundTruthBag = sessionConfig.groundTruthBag.replace(this.baseUrl + '/', this.dataDir)
    log.warn(sessionConfig)

    // Create a new engine trainingInstance
    const trainingInstance = new trainer(sessionId, sessionConfig)
    this.addTrainingInstance(trainingInstance)

    // Attach error handler
    trainingInstance.on('ERROR', (exitCode, error) => {
      Object.assign(trainingInstance.session, {
        exitCode,
        error
      })
    })

    // TODO other event handlers

    return trainingInstance
  }

  listTrainingInstances() {
    return [...this._trainingQueue]
  }

  getTrainingInstanceById(idOrSession) {
    if (typeof idOrSession !== 'string') {
      idOrSession = idOrSession.id
    }
    return this._trainingQueue.find(trainingInstance => trainingInstance.id === idOrSession)
  }

  addTrainingInstance(trainingInstance) {
    this._trainingQueue.push(trainingInstance)
  }

}
