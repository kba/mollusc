const {EventEmitter} = require('events')
const TrainingSession = require('../training-session')

/**
 * Base class for all engines
 */
module.exports = class BaseEngine extends EventEmitter {

  /**
   * Create a new instance of this engine
   * TODO valdiate sessionConfig
   *
   * @return {TrainingSession}
   */
  constructor(sessionConfig) {
    super()
    // Create a TrainingSession object
    this.session = new TrainingSession(sessionConfig)
    this.child_process = null
  }

  start() {
    throw new Error("start() must be implemented!")
  }

  pause() {
    if (this.session.state === 'PAUSED')
      return
    this.child_process.kill('SIGTSTP')
    this.session.state = 'PAUSED'
    this.emit('PAUSED')
  }

  resume() {
    if (this.session.state === 'PAUSED')
      return
    this.child_process.kill('SIGCONT')
    this.session.state = 'STARTED'
    this.emit('STARTED')
  }

  stop() {
    this.child_process.kill('SIGHUP')
    this.session.state = 'STOPPED'
    this.emit('STOPPED')
  }

}
