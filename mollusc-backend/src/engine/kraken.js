const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const log = require('@ocrd/mollusc-shared').createLogger('kraken')
const glob = require('glob')
const {join} = require('path')

let __version = null

module.exports = class KrakenEngine {

  static get name() {return 'kraken'}
  static get trainer() {return KrakenTrainer}
  static get recognizer() {return KrakenRecognizer}
  static get version() {return KrakenTrainer.version}
}

/**
 * Recognize with kraken
 */
//{{{ KrakenRecognizer
class KrakenRecognizer extends BaseEngine {

  static get name() {return 'kraken'}
  static get version() {
    if (__version)
      return __version
    else {
      const resp = spawnSync('kraken', ['--version'], {encoding: 'utf8'})
      if (resp.error) throw resp.error
      __version = resp.stdout.replace('kraken, version ', '').trim()
      return __version
    }
  }

  // async recognize(model, ...images) {
  //   if (model.startsWith('http://') || model.startsWith('https://')) {
  //     const
  //   }
  //   const
  //   spawnSync('kraken', [
  //     '--verbose',
  //     '-i', pathToImg, '/dev/stdout',
  //     'ocr',
  //     '-s',
  //     '-m', model
  //   ], {encoding: 'utf8'})
  //   let text = ''
  //   return text
  // }

  _parseLine(line) {
    let ret = line
    // if (line.match(/Accuracy report/)) {
    //   line.replace(/\((\d+)\) (\d+\.\d+) (\d+) (\d+)/, (_, iteration, accuracy, chars, error) => {
    //     ret = ['addIteration', {
    //       iteration: parseInt(iteration),
    //       accuracy: parseFloat(accuracy),
    //       chars: parseInt(chars),
    //       error: parseInt(error)
    //     }]
    //   })
    // } else if (line.match("Saving to ")) {
    //   line.replace(/Saving to ([^\s]+)/, (_, checkpointBasename) => {
    //     ret = ['addCheckpoint', {
    //       path: join(this.session.config.cwd, `${checkpointBasename}.mlmodel`),
    //       mediaType: 'application/vnd.ocrd.coreml',
    //     }]
    //   })
    // }
    return ret
  }

  _setCmdLine() {

    const {session} = this

    const cmdLine = []
    // verbose
    cmdLine.push('-vv')
    // subcommand
    cmdLine.push('ocr')
    // Treat images as single lines
    cmdLine.push('--no-segmentation')
    // Create text
    cmdLine.push('--text')
    // custom arguments
    cmdLine.push(...this.session.config.trainerArgs)
    // File arguments
    // TODO respect manifest conventions
    // const toGlob = join(this.gtDir, 'data', 'ground-truth', `${session.config.evaluationGlob}.tif`)
    log.debug({toGlob})
    cmdLine.push(...glob.sync(toGlob))

    session.cmdLine = ['kraken', cmdLine]
  }

}
//}}}

/**
 * Train with ketos
 */
//{{{ KrakenTrainer
class KrakenTrainer extends BaseEngine {

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
        ret = ['addIteration', {
          iteration: parseInt(iteration),
          accuracy: parseFloat(accuracy),
          chars: parseInt(chars),
          error: parseInt(error)
        }]
      })
    } else if (line.match("Saving to ")) {
      line.replace(/Saving to ([^\s]+)/, (_, checkpointBasename) => {
        ret = ['addCheckpoint', {
          path: join(this.session.config.cwd, `${checkpointBasename}.mlmodel`),
          mediaType: 'application/vnd.ocrd.coreml',
        }]
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
    // Save every 0.2 epochs
    cmdLine.push('--savefreq', 0.2)
    // custom arguments
    cmdLine.push(...this.session.config.trainerArgs)
    // File arguments
    // TODO respect manifest conventions
    const toGlob = join(this.gtDir, 'data', 'ground-truth', `${session.config.trainingGlob}.tif`)
    log.debug({toGlob})
    cmdLine.push(...glob.sync(toGlob))

    session.cmdLine = ['ketos', cmdLine]
  }

}
//}}}
