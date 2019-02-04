const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const {join} = require('path')

const glob = require('glob')
const log = require('@ocrd/mollusc-shared').createLogger('calamari')

let __version = null

/**
 * Train with ketos
 */
module.exports = class CalamariEngine {

  static get name() {return 'calamari'}
  static get trainer() {return CalamariTrainer}
  static get recognizer() {return CalamariRecognizer}
  static get version() {return CalamariTrainer.version}
}

/**
 * Recognize with calamari
 */
class CalamariRecognizer extends BaseEngine {

  static get name() {return 'calamari'}
  static get version() {
    if (__version)
      return __version
    else {
      const resp = spawnSync('calamari-predict', ['--version'], {encoding: 'utf8'})
      if (resp.error) throw resp.error
      __version = resp.stdout.replace('calamari-predict v', '').trim()
      return __version
    }
  }
}


class CalamariTrainer extends BaseEngine {

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

  static validateSessionConfig(sessionConfig) {
    if (sessionConfig.outputModelFormat !== 'application/vnd.ocrd.tf+zip') {
      log.error(`outputModelFormat not supported: ${sessionConfig.outputModelFormat}`)
      return false
    }
    return true
  }

  _parseLine(line) {
    let ret = line
    if (line.match(/^#\d+:/)) {
      line.replace(/^#(\d+): .* ler=(\d+.\d+)/, (_, iteration, error) => {
        ret = ['addIteration', {
          iteration: parseInt(iteration),
          error: parseFloat(error),
          accuracy: -1,
          chars: -1,
        }]
      })
    } else if (line.match("^Storing checkpoint to ")) {
      line.replace(/Storing checkpoint to '([^']+)'/, (_, checkpoint) => {
        ret = ['addCheckpoint', checkpoint]
      })
    }
    return ret
  }

  _setCmdLine() {

    const {session} = this

    const cmdLine = []
    // custom arguments
    cmdLine.push(...this.session.config.engineArguments)
    // File arguments
    // TODO respect manifest conventions
    const toGlob = join(this.gtDir, 'data', 'ground-truth', `${session.config.groundTruthGlob}.tif`)
    log.debug({toGlob})
    cmdLine.push('--files')
    cmdLine.push(...glob.sync(toGlob))

    session.cmdLine = ['calamari-train', cmdLine]
  }


}
