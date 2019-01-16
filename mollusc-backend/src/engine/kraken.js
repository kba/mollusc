const {spawnSync} = require('child_process')

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

  constructor(...args) {
    super(...args)

    const cmdLine = []
    // verbose
    cmdLine.push('-vv')
    // subcommand
    cmdLine.push('train')
    // Report frequently
    cmdLine.push('--report', 0.2)
    // custom arguments
    cmdLine.push(...this.session.config.engineArguments)
    console.log({cmdLine})
    // TODO add args
    this.session.cmdLine = ['ketos', cmdLine]
    // Object.assign(this.session.cmdLine, {cmdLine})
  }

  _receiveLine(line) {
    console.log({line})
  }

}
