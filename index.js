#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const { rename, toStateless } = require('@creuna/react-scripts');

const printHelp = require('./print-help');

switch (process.argv[2]) {
  case 'new':
    console.log('Create new project');
    break;
  case 'component':
    console.log('Create component');
    break;
  case 'mockup':
    console.log('Create mockup page');
    break;
  case 'rename':
    rename(process.argv[3], process.argv[4]);
    break;
  case 'stateful':
    console.log('To stateful');
    break;
  case 'stateless':
    toStateless(process.argv[3]);
    break;
  case undefined:
    printHelp();
    break;
  default:
    console.log(`Unrecognized command ${chalk.redBright(process.argv[2])}`);
    printHelp();
}
