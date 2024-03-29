const {NEW} = require('./session/states')
/**
 * Represents a running training session
 */
module.exports = class TrainingSession {

  constructor(id, config) {
    if (typeof id === 'string') {
      this.id = id
      this.config = config
      this.state = NEW
      this.checkpoints = []
      this.epochs = []
      this.log = []
      this.env = {}
    } else {
      Object.assign(this, id)
    }
  }

  addCheckpoint(data) {
    this.checkpoints.push([new Date(), data])
  }

  addEpoch(data) {
    this.epochs.push([new Date(), data])
  }

}
