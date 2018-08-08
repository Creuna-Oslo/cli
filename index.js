#!/usr/bin/env node
/* eslint-env node */
const currentVersion = require('./source/get-this-version');
const messages = require('./source/messages');
const [command, arg1, arg2] = process.argv.slice(2);

// The following two blocks are placed here in order to ensure fast shell output for 'creuna' and 'creuna -v'. (Node.js spends a small eternity importing and parsing the dependencies.)
if (!command) {
  messages.help();
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  messages.version(currentVersion);
  process.exit(0);
}

const appCreator = require('@creuna/create-react-app');
const path = require('path');
const semver = require('semver');

const configstore = require('./source/configstore');
const fetchLatestVersion = require('./source/fetch-latest-version');
const getConfig = require('./source/get-config');
const getNewAppInput = require('./source/get-new-app-input');
const lib = require('./source/get-components-from-library');
const maybeWriteVSCodeTasks = require('./source/maybe-write-vscode-tasks');
const runReactScript = require('./source/run-react-script');
const supportedCommands = require('./source/supported-commands');

fetchLatestVersion();

let shouldExit = false;

if (!command) {
  shouldExit = true;
} else if (Object.values(supportedCommands).includes(command)) {
  (async () => {
    const {
      componentsPath = process.cwd(),
      eslintConfig,
      mockupPath = process.cwd()
    } = await getConfig();

    if (command === supportedCommands.lib) {
      return lib(componentsPath);
    }

    if (command === supportedCommands.new) {
      const projectPath = path.join(process.cwd(), arg1 || '');

      return appCreator
        .canWriteFiles(projectPath)
        .then(() => getNewAppInput())
        .then(answers =>
          appCreator.writeFiles(Object.assign({}, answers, { projectPath }))
        )
        .then(async response => {
          await maybeWriteVSCodeTasks(projectPath);

          messages.emptyLine();
          messages.messageList(response.messages);
          messages.emptyLine();
        })
        .catch(messages.error);
    }

    // If the command isn't 'new' or 'lib', the command is a @creuna/react-scripts command.
    runReactScript({
      arg1,
      arg2,
      eslintConfig,
      command,
      componentsPath,
      mockupPath
    })
      .then(response => {
        messages.emptyLine();
        messages.messageList(response.messages);
        messages.emptyLine();
      })
      .catch(messages.error);
  })();
} else {
  messages.unrecognizedCommand(command);
  messages.help();
  shouldExit = true;
}

const latestVersion = configstore.get('latestVersion');
if (latestVersion && semver.gt(latestVersion, currentVersion)) {
  messages.emptyLine();
  messages.versionConflict(currentVersion, latestVersion);
  messages.emptyLine();
}

if (shouldExit) {
  process.exit(0);
}
