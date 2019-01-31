const {spawnSync} = require('child_process')
const BaseEngine = require('./base')
const {join} = require('path')
const log = require('@ocrd/mollusc-shared').createLogger('ocropus')
const glob = require('glob')

let __version = null

/**
 * Train with ocropus
 */
module.exports = class OcropusEngine extends BaseEngine {

  static get name() {return 'ocropus'}
  static get capabilities() {return ['training']}
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

  static validateSessionConfig(sessionConfig) {
    if (sessionConfig.outputModelFormat !== 'application/vnd.ocrd.pyrnn') {
      log.error(`outputModelFormat not supported: ${sessionConfig.outputModelFormat}`)
      return false
    }
    return true
  }

  constructor(...args) {
    super(...args)

    // Set MPLBACKEND to Agg so tkinter will be happy
    this.session.env.MPLBACKEND = 'Agg'
  }

  _parseLine(line) {
    let ret = line
    if (line.match(/^\d+ \d+\.\d+/)) {
      line.replace(/^(\d+) (\d+\.\d+)/, (_, iteration, error) => {
        ret = ['addEpoch', {
          iteration: parseInt(iteration),
          accuracy: -1,
          chars: -1,
          error: parseFloat(error)
        }]
      })
    } else if (line.match('^# saving ')) {
      ret = ['addCheckpoint', join(this.session.config.cwd, line.replace(/^# saving /, ''))]
    }
    return ret
  }

  _setCmdLine() {

    const {session} = this
    const cmdLine = []

    // //   --updates             verbose LSTM updates
    // cmdLine.push('--updates')

    // Save every 5 epochs
    cmdLine.push('--savefreq', 5)

    // Output
    cmdLine.push('--output')
    cmdLine.push('model-%d.pyrnn')

    // custom arguments
    cmdLine.push(...this.session.config.engineArguments)

    // add files
    // TODO respect manifest conventions
    const toGlob = join(this.gtDir, 'data', 'ground-truth', `${session.config.groundTruthGlob}.tif`)
    log.debug({toGlob})
    cmdLine.push(...glob.sync(toGlob))

    this.session.cmdLine = ['ocropus-rtrain', cmdLine]
  }

}
