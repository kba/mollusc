const {createLogger} = require('@ocrd/mollusc-shared')
let log = createLogger('foo')

log.silly('foo')
log.debug('foo')
log.info('foo')
log.warn('foo')
log.error('foo')
log.debug('foo', {label: 'bar'})

log = createLogger('bar', {level: 'warn'})

log.silly('foo')
log.debug('foo')
log.info('foo')
log.warn('foo')
log.error('foo')
log.debug('foo', {label: 'bar'})
