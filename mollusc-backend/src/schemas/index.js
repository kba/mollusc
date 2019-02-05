const Ajv = new require('ajv')({
  allErrors: true,
  useDefaults: true,
  schemas: {
    'training': require('./training-schema.json'),
    'model-evaluation': require('./model-evaluation-schema.json'),
  },
})

module.exports = id => {
  const validate = Ajv.getSchema(id)
  if (! validate) {
    throw new Error(`Unregistered schema ${id}`)
  }
  return obj => {
    if (!validate(obj)) {
      const err = new Error(`Invalid config`)
      err.errors = validate.errors
      throw err
    }
    return true
  }
}
