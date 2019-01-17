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
      },
      host: {
        desc: 'Host to start server',
        default: 'localhost'
      },
      baseUrl: {
        desc: 'Prefix to use for relative URL. Defaults to http://${host}:${port}',
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
    let {host, port, baseUrl} = args
    if (!baseUrl) baseUrl = `http://${host}:${port}`
    server.start({host, port, baseUrl})
  }
}

