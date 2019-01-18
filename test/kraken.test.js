const engine = require('@ocrd/mollusc-backend').engines.kraken

const x = engine.prototype._parseLine('Accuracy report (14) 0.0000 132 130')
console.log({x})
