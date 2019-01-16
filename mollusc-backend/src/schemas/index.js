const Ajv = new require('ajv')({
  allErrors: true,
  schemas: {
    'training': require('./training-schema.json')
  },
})

module.exports = id => {
  validate = Ajv.getSchema(id)
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
