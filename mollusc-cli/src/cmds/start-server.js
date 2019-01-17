const MolluscServer = require('@ocrd/mollusc-server')

module.exports = {
  desc: 'Start the server',
  builder(yargs) {
    // console.log({yargs})
    yargs.options({
      watch: {
        alias: ['-w'],
        type: 'boolean',
        desc: 'Restart on changes to source code in $PWD',
        default: false
      },
      port: {
        desc: 'Port to start server on',
        default: 3434
      }
    })
  },
  handler(args) {
    // console.log({args})
    if (args.watch) {
      const {execSync} = require('child_process')
      const {quote} = require('shell-quote')
      const cmd = `nodemon -x "${quote(process.argv)} --no-watch"`
      console.log(cmd)
      execSync(cmd, {stdio: 'inherit'})
      process.exit()
    }
    const server = new MolluscServer()
    server.start(args.port)
  }
}

