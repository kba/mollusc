/**
 * Represents a running training session
 */
module.exports = class TrainingSession {

  constructor(config) {
    this.config = config
    this.state = 'NEW'
    this.epochs = []
  }

  addEpoch(data) {
    this.epochs.push([new Date(), data])
  }

}
