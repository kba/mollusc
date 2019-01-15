const {spawn, spawnSync} = require('child_process')
const readline = require('readline')

const BaseEngine = require('./base')

let __version = null

/**
 * Train with ketos
 */
module.exports = class KrakenEngine extends BaseEngine {

  static get name() {return 'kraken/ketos'}

  static get version() {
    if (__version)
      return __version
    else {
      const resp = spawnSync('ketos', ['--version'], {encoding: 'utf8'})
      if (resp.error) throw resp.error
      __version = resp.stdout.replace('ketos, version ', '').trim()
      return __version
    }
  }

  static validateSessionConfig() {
    // TODO implementation
    return true
  }

  start() {
    const args = ['train', ...this.session.config.engineArguments]
    this.session.cmdLine = ['ketos', args]
    // TODO add args
    this.emit('STARTING')
    this.child_process = spawn(...this.session.cmdLine)
    this.child_process.on('close', () => this.session.state = 'STOPPED')
    this.child_process.on('error', (...args) => this.emit('error', ...args))
    readline.createInterface({
        input     : this.child_process.stdout,
        terminal  : false
    }).on('line', function(line) {
        console.log('LINE', {line})
    })
    // this.child_process.once('data', () => this.emit('STARTED'))
    this.session.state = 'STARTED'
    this.emit('STARTED')
  }

}
