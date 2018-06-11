#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const newProject = require('@creuna/create-react-app');
const {
  newComponent,
  newPage,
  rename,
  toStateful,
  toStateless
} = require('@creuna/react-scripts');

const getConfig = require('./source/get-config');
const lib = require('./source/get-components-from-library');
const printHelp = require('./print-help');
const [command, arg1, arg2] = process.argv.slice(2);

if (command === 'new') {
  // 'new' does not require .creunarc.json
  newProject();
} else {
  // All other commands require .creunarc.json to run
  getConfig().then(({ componentsPath }) => {
    switch (command) {
      case 'lib':
        lib(componentsPath);
        break;
      case 'component':
        newComponent(
          arg1,
          process.argv.indexOf('-s') !== -1 ? true : undefined
        );
        break;
      case 'page':
        newPage(arg1);
        break;
      case 'rename':
        rename(arg1, arg2);
        break;
      case 'stateful':
        toStateful(arg1);
        break;
      case 'stateless':
        toStateless(arg1);
        break;
      case undefined:
        printHelp();
        break;
      default:
        console.log(`Unrecognized command ${chalk.redBright(process.argv[2])}`);
        printHelp();
    }
  });
}
