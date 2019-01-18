const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const log = require('@ocrd/mollusc-shared').createLogger('kraken')

let __version = null

/**
 * Train with ocropus
 */
module.exports = class OcropusEngine extends BaseEngine {

  static get name() {return 'ocropus'}

  static get version() {
    if (__version)
      return __version
    else {
      const env = {...process.env, MPLBACKEND: 'Agg'}
      const resp = spawnSync('ocropus-rtrain', ['--version'], {encoding: 'utf8', env})
      if (resp.error) throw resp.error
      __version = resp.stdout.replace('ocropus-rtrain, v', '').trim()
      return __version
    }
  }

  static validateSessionConfig() {
    // TODO implementation
    return true
  }

  constructor(...args) {
    super(...args)

    // Set MPLBACKEND to Agg so tkinter will be happy
    this.session.env.MPLBACKEND = 'Agg'

    const cmdLine = []

    //   --updates             verbose LSTM updates
    cmdLine.push('--updates')

    // Report every 5 epochs
    cmdLine.push('--savefreq', 5)

    // Output
    cmdLine.push('foo-%d.pyrnn.gz')

    // custom arguments
    cmdLine.push(...this.session.config.engineArguments)

    // add files
    cmdLine.push('*.bin.png')

    this.session.cmdLine = ['ocropus-rtrain', cmdLine]

    log.debug({cmdLine})
  }

  _receiveLine(line) {
    log.debug({line})
  }

}
