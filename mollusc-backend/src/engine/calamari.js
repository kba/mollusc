const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const log = require('@ocrd/mollusc-shared').createLogger('kraken')

let __version = null

/**
 * Train with ketos
 */
module.exports = class CalamariEngine extends BaseEngine {

  static get name() {return 'calamari'}

  static get version() {
    if (__version)
      return __version
    else {
      const resp = spawnSync('calamari-train', ['--version'], {encoding: 'utf8'})
      if (resp.error) throw resp.error
      __version = resp.stdout.replace('calamari-train v', '').trim()
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
    log.debug({cmdLine})
    // TODO add args
    this.session.cmdLine = ['ketos', cmdLine]
    // Object.assign(this.session.cmdLine, {cmdLine})
  }

  _receiveLine(line) {
    log.debug({line})
  }

}
