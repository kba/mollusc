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
  static get capabilities() {return ['training']}
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

  static validateSessionConfig(sessionConfig) {
    if (sessionConfig.outputModelFormat !== 'application/vnd.ocrd.coreml') {
      log.error(`outputModelFormat not supported: ${sessionConfig.outputModelFormat}`)
      return false
    }
    return true
  }

  _parseLine(line) {
    let ret = line
    if (line.match(/Accuracy report/)) {
      line.replace(/\((\d+)\) (\d+\.\d+) (\d+) (\d+)/, (_, iteration, accuracy, chars, error) => {
        ret = ['addEpoch', {
          iteration: parseInt(iteration),
          accuracy: parseFloat(accuracy),
          chars: parseInt(chars),
          error: parseInt(error)
        }]
      })
    } else if (line.match("Saving to ")) {
      line.replace(/Saving to ([^\s]+)/, (_, checkpointBasename) => {
        ret = ['addCheckpoint', join(this.session.config.cwd, `${checkpointBasename}.mlmodel`)]
      })
    }
    return ret
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
