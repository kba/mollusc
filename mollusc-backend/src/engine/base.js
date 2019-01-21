const {spawn, execFileSync} = require('child_process')
const {eachLine} = require('line-reader')
const {EventEmitter} = require('events')
const mkdirp = require('mkdirp')
const {join} = require('path')
const {writeFileSync} = require('fs')

const Session = require('../session')
const {STARTING, NEW, STARTED, PAUSED, STOPPED, ERROR} = require('../session/states')

const log = require('@ocrd/mollusc-shared').createLogger('engine.base')

function unzipTo(zippath, outpath) {
  mkdirp.sync(outpath)
  return execFileSync(`unzip`, [zippath], {
    cwd: outpath,
    encoding: 'utf8',
  })
}

/**
 * Base class for all engines
 */
module.exports = class BaseEngine extends EventEmitter {

  /**
   * Create a new instance of this engine
   * TODO valdiate sessionConfig
   *
   * @return {Session}
   */
  constructor(id, sessionConfig) {
    super()
    this.id = id
    // Create a Session object
    this.session = new Session(id, sessionConfig)
    this.child_process = null
    this._stderr = []

    const {cwd}      = sessionConfig
    this.gtDir       = join(cwd, 'groundTruthBag')
    this.sessionFile = join(cwd, 'session.json')
  }

  start() {
    const {session} = this
    if (session.state !== NEW)
      return

    this._changeState(STARTING)

    // Unzip the Bag
    console.log(unzipTo(session.config.groundTruthBag, this.gtDir))
    // this.session.log.push()

    // Set command line
    this._setCmdLine()

    // Spawn the process
    const spawnArgs = [
      ...session.cmdLine, {
        cwd: session.config.cwd,
        env: {
          ...process.env,
          ...session.env
        }
      }
    ]
    log.info("Spawning child process")
    log.info(spawnArgs)
    this.child_process = spawn(...spawnArgs)

    // Handle STDOUT lines
    eachLine(this.child_process.stdout, line => {
      session.log.push(line)
      this._receiveLine(line)
    })

    // Collect STDERR
    eachLine(this.child_process.stderr, line => this._stderr.push(line))

    // Handle exit of process
    this.child_process.on('close', (code) =>  {
      setTimeout(() => {
        if (code) {
          this._changeState(ERROR, code, this._stderr)
        } else {
          this._changeState(STOPPED)
        }
      }, 500)
    })

    // Handle error conditions like not being able to spawn, lost i/o, zombies
    this.child_process.on('error', (...args) => () => this._changeState(ERROR, ...args))

    this._changeState(STARTED)
  }

  pause() {
    if (this.session.state !== STARTED)
      return
    this.child_process.kill('SIGTSTP')
    this._changeState(PAUSED)
  }

  resume() {
    if (this.session.state !== PAUSED)
      return
    this.child_process.kill('SIGCONT')
    this._changeState(STARTED)
  }

  stop() {
    if (this.session.state === STOPPED || this.session.state === ERROR)
      return
    this.child_process.kill('SIGHUP')
    this._changeState(STOPPED)
  }

  /* ======================================================================
   * Private API
   * ====================================================================== */
  _parseLine(line) {
    throw new Error("_parseLine() must be implemented!")
  }

  _receiveLine(line) {
    const parsed = this._parseLine(line)
    if (typeof parsed === 'string') {
      log.debug(`[Session ${this.id}] UNHANDLED LINE: "${line}"`)
    } else if (parsed[0] === 'addEpoch') {
      this.session.addEpoch(parsed[1])
    } else if (parsed[0] === 'addCheckpoint') {
      this.session.addCheckpoint(parsed[1])
    }
  }

  _changeState(state, ...args) {
    if (state === ERROR) {
      log.error(`[${this.session.id}] ${[...args]}`)
    }
    Object.assign(this.session, {state})
    this._saveSession()
    this.emit(state, ...args)
  }

  _setCmdLine() {
    throw new Error("_setCmdLine() must be implemented!")
  }

  _saveSession() {
    writeFileSync(this.sessionFile, JSON.stringify(this.session, null, 2))
  }


}
