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

  _parseLine(line) {
    let ret = line
    if (line.match(/Accuracy report/)) {
      line.replace(/\((\d+)\) (\d+\.\d+) (\d+) (\d+)/, (_, iteration, accuracy, chars, error) => {
        ret = {
          iteration: parseInt(iteration),
          accuracy: parseFloat(accuracy),
          chars: parseInt(chars),
          error: parseInt(error)
        }
      })
    }
    return ret
  }

  _receiveLine(line) {
    const parsed = this._parseLine(line)
    if (typeof parsed === 'string') {
      log.debug(`UNHANDLED LINE: "${line}"`)
    } else {
      this.session.addEpoch(parsed)
    }
  }

  _setCmdLine() {

    const {session} = this

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
    // File arguments
    // TODO respect manifest conventions
    const toGlob = join(this.gtDir, 'data', 'ground-truth', `${session.config.groundTruthGlob}.tif`)
    log.debug({toGlob})
    cmdLine.push(...glob.sync(toGlob))

    session.cmdLine = ['ketos', cmdLine]
  }

}
