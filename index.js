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

const configstore = require('./source/configstore');
const version = require('./source/get-this-version');
const getConfig = require('./source/get-config');
const lib = require('./source/get-components-from-library');
const printHelp = require('./source/print-help');
const [command, arg1, arg2] = process.argv.slice(2);
const fetchLatestVersion = require('./source/fetch-latest-version');

fetchLatestVersion();

const supportedCommands = {
  component: 'component',
  lib: 'lib',
  new: 'new',
  page: 'page',
  rename: 'rename',
  stateful: 'stateful',
  stateless: 'stateless'
};

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(version);
  process.exit(0);
}

const latestVersion = configstore.get('latestVersion');
if (latestVersion && version !== latestVersion) {
  console.log(
    `🦄  ${chalk.greenBright(
      `You are using version ${chalk.blueBright(
        version
      )}, but the latest version is ${chalk.blueBright(latestVersion)}.`
    )}`
  );
  console.log(
    `👩‍💻  Run ${chalk.blueBright('yarn global add @creuna/cli')} or ${chalk.cyan(
      'npm i -g @creuna/cli'
    )} to get the latest version.`
  );
  console.log('');
}

if (!command) {
  printHelp();
} else if (command === supportedCommands.new) {
  // 'new' does not require .creunarc.json
  newProject();
} else if (Object.values(supportedCommands).includes(command)) {
  // All other commands require .creunarc.json to run
  getConfig()
    .then(({ componentsPath, mockupPath }) => {
      switch (command) {
        case supportedCommands.lib:
          lib(componentsPath);
          break;
        case supportedCommands.component:
          newComponent(
            arg1,
            process.argv.indexOf('-s') !== -1 ? true : undefined,
            componentsPath
          );
          break;
        case supportedCommands.page:
          newPage(arg1, mockupPath);
          break;
        case supportedCommands.rename:
          rename(arg1, arg2, componentsPath);
          break;
        case supportedCommands.stateful:
          toStateful(arg1, componentsPath);
          break;
        case supportedCommands.stateless:
          toStateless(arg1, componentsPath);
          break;
        default:
          // NOTE: This should never happen
          printHelp();
          break;
      }
    })
    .catch(error => {
      console.log(
        `😱 ${chalk.redBright(
          'Error reading configuration file'
        )} ${chalk.blueBright('.creunarc.json')}${chalk.redBright(
          '. See https://github.com/Creuna-Oslo/cli'
        )}`
      );
    });
} else {
  // NOTE: Unrecognized command
  console.log(`😱  Unrecognized command "${chalk.redBright(command)}".`);
  printHelp();
}
