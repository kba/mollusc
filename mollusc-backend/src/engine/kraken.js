const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const log = require('@ocrd/mollusc-shared').createLogger('kraken')
const glob = require('glob')
const {join} = require('path')

let __version = null

/**
 * Train with ketos
 */
module.exports = class KrakenEngine extends BaseEngine {

  static get name() {return 'kraken'}

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
    // Save every epoch
    cmdLine.push('--savefreq', 0.2)
    // custom arguments
    cmdLine.push(...this.session.config.engineArguments)
    this.session.cmdLine = ['ketos', cmdLine]
  }

  _receiveLine(line) {
    log.debug({line})
  }

  _beforeSpawn() {
    this.session.cmdLine[1].push(
      ...glob.sync(join(this.gtDir, 'ground-truth', '*.tif')))
  }

}
