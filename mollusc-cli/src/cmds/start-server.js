const MolluscServer = require('@ocrd/mollusc-server')

module.exports = {
  desc: 'Start the server',
  builder(yargs) {
    // console.log({yargs})
    yargs.options({
      port: {
        desc: 'Port to start server on',
        default: 3434
      }
    })
  },
  handler(args) {
    // console.log({args})
    const server = new MolluscServer()
    server.start(args.port)
  }
}
