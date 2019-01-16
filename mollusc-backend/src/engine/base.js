const {spawn} = require('child_process')
const {eachLine} = require('line-reader')
const {EventEmitter} = require('events')

const Session = require('../session')
const {STARTING, NEW, STARTED, PAUSED, STOPPED, ERROR} = require('../session/states')

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
  constructor(sessionConfig) {
    super()
    // Create a Session object
    this.session = new Session(sessionConfig)
    this.child_process = null
    this._stderr = []
  }

  start() {
    if (this.session.state !== NEW)
      return

    this._changeState(STARTING)

    // Spawn the process
    this.child_process = spawn(...this.session.cmdLine)

    // Handle STDOUT lines
    eachLine(this.child_process.stdout, line => {
      this.session.log.push(line)
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


}
