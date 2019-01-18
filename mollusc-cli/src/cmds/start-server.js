const MolluscServer = require('@ocrd/mollusc-server')
const mkdirp = require('mkdirp')

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
      },
      dataDir: {
        desc: 'Data directory to store uploads and temp data.',
        default: `${process.env.HOME}/mollusc/`,
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
    let {host, port, baseUrl, dataDir} = args

    if (!baseUrl)
      baseUrl = `http://${host}:${port}`

    mkdirp.sync(dataDir)

    const server = new MolluscServer()
    server.start({host, port, baseUrl, dataDir})
  }
}

