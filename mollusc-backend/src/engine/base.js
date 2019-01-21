const {spawn, execFileSync} = require('child_process')
const {eachLine} = require('line-reader')
const {EventEmitter} = require('events')
const mkdirp = require('mkdirp')
const {join} = require('path')
const {writeFile} = require('fs')

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
  }

  start() {
    const {session} = this
    if (session.state !== NEW)
      return

    this._changeState(STARTING)

    // Unzip the Bag
    const gtDir = this.gtDir = join(session.config.cwd, 'groundTruthBag')
    console.log(unzipTo(session.config.groundTruthBag, gtDir))
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

  _receiveLine(line) {
    throw new Error("_receiveLine() must be implemented!")
  }

  _changeState(state, ...args) {
    Object.assign(this.session, {state})
    this.emit(state, ...args)
  }

  _setCmdLine() {
    throw new Error("_setCmdLine() must be implemented!")
  }

  _saveSession() {
    const {cwd} = this.session.config
    const saveName = join(cwd, 'session.json')
    writeFile(saveName, JSON.stringify(this.session))
  }


}
