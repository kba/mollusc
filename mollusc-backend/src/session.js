const {NEW} = require('./session/states')
/**
 * Represents a running training session
 */
module.exports = class TrainingSession {

  constructor(id, config) {
    this.id = id
    this.config = config
    this.state = NEW
    this.epochs = []
    this.log = []
    this.env = {}
  }

  addEpoch(data) {
    this.epochs.push([new Date(), data])
  }

}
