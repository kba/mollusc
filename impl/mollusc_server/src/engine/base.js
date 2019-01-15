const {spawn} = require('child_process')
const {eachLine} = require('line-reader')
const {EventEmitter} = require('events')

const Session = require('../session')
const {STARTING, STARTED, PAUSED, STOPPED} = require('../session/states')

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
  }

  start() {
    this.emit(STARTING)
    this.child_process = spawn(...this.session.cmdLine)
    eachLine(this.child_process.stdout, {
      // separator: '\r',
    }, line => {
      this.session.log.push(line)
      this.receiveLine(line)
    })
    this.child_process.on('close', () => setTimeout(() => this.stop(), 1000))
    this.child_process.on('disconnect', () => setTimeout(() => this.stop(), 1000))
    this.child_process.on('error', (...args) => this.emit('error', ...args))
    this.session.state = STARTED
    this.emit(STARTED)
  }

  pause() {
    if (this.session.state === PAUSED)
      return
    this.child_process.kill('SIGTSTP')
    this.session.state = PAUSED
    this.emit(PAUSED)
  }

  resume() {
    if (this.session.state !== PAUSED)
      return
    this.child_process.kill('SIGCONT')
    this.session.state = STARTED
    this.emit(STARTED)
  }

  stop() {
    this.child_process.kill('SIGHUP')
    this.session.state = STOPPED
    this.emit(STOPPED)
  }

  receiveLine(line) {
    throw new Error("receiveLine() must be implemented!")
  }

}
