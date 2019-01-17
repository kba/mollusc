const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const log = require('@ocrd/mollusc-shared').createLogger('kraken')

let __version = null

/**
 * Train with ketos
 */
module.exports = class TesseractEngine extends BaseEngine {

  static get name() {return 'tesseract'}

  static get version() {
    if (__version)
      return __version
    else {
      const env = {...process.env, MPLBACKEND: 'Agg'}
      const resp = spawnSync('lstmtraining', ['--version'], {encoding: 'utf8', env})
      if (resp.error) throw resp.error
      __version = resp.stdout.trim()
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

    // Set MPLBACKEND to Agg so tkinter will be happy
    this.session.env.MPLBACKEND = 'Agg'
  }

  _receiveLine(line) {
    log.debug({line})
  }

}
