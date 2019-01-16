#!/usr/bin/env node
const yargs = require('yargs')
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
