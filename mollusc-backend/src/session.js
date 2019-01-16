const {NEW} = require('./session/states')
/**
 * Represents a running training session
 */
module.exports = class TrainingSession {

  constructor(config) {
    this.config = config
    this.state = NEW
    this.epochs = []
    this.log = []
  }

  addEpoch(data) {
    this.epochs.push([new Date(), data])
  }

  toJSON() {
    return JSON.stringify(this)
  }

}
