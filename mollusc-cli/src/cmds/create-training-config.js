const {engines} = require('@ocrd/mollusc-backend')
const trainingSchema = require('@ocrd/mollusc-backend/src/schemas/training-schema.json')
module.exports = {
  desc: 'Create a training config',
  builder(yargs) {
    yargs.options({
      engineName: {type: 'string', required: true, choices: Object.keys(engines)},
      engineVersion: {type: 'string', required: true},
      groundTruthBag: {type: 'string', required: true},
      groundTruthGlob: {type: 'string', default: '*'},
      outputModelFormat: {type: 'string', required: true, choices: trainingSchema.properties.outputModelFormat.enum},
    })
  },
  handler(args) {
    const {engineName, engineVersion, groundTruthBag, groundTruthGlob, outputModelFormat} = args
    console.log(JSON.stringify({engineName, engineVersion, groundTruthBag, groundTruthGlob, outputModelFormat}, null, 2))
  }
}

