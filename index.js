#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const newProject = require('@creuna/create-react-app');
const {
  newComponent,
  newPage,
  rename,
  toStateful,
  toStateless
} = require('@creuna/react-scripts');

const latestVersion = require('./source/get-latest-version');
const currentVersion = require('./source/get-this-version');
const getConfig = require('./source/get-config');
const lib = require('./source/get-components-from-library');
const messages = require('./source/messages');
const [command, arg1, arg2] = process.argv.slice(2);

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
  messages.version(currentVersion);
  process.exit(0);
}

let shouldExit = false;

if (!command) {
  messages.help();
  shouldExit = true;
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
          messages.help();
          shouldExit = true;
          break;
      }
    })
    .catch(() => {
      messages.errorReadingConfig();
      shouldExit = true;
    });
} else {
  messages.unrecognizedCommand(command);
  messages.help();
  shouldExit = true;
}

if (latestVersion && currentVersion !== latestVersion) {
  messages.versionConflict(currentVersion, latestVersion);
}

if (shouldExit) {
  process.exit(0);
}
