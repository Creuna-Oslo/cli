#!/usr/bin/env node
/* eslint-env node */
const messages = require('./source/messages');
const [command, arg1, arg2] = process.argv.slice(2);

if (!command) {
  messages.help();
}

const appCreator = require('@creuna/create-react-app');
const path = require('path');
const semver = require('semver');

const configstore = require('./source/configstore');
const currentVersion = require('./source/get-this-version');
const fetchLatestVersion = require('./source/fetch-latest-version');
const getConfig = require('./source/get-config');
const getNewAppInput = require('./source/get-new-app-input');
const lib = require('./source/get-components-from-library');
const maybeWriteVSCodeTasks = require('./source/maybe-write-vscode-tasks');
const runReactScript = require('./source/run-react-script');
const supportedCommands = require('./source/supported-commands');

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  messages.version(currentVersion);
  process.exit(0);
}

fetchLatestVersion();

let shouldExit = false;

if (!command) {
  shouldExit = true;
} else if (command === supportedCommands.new) {
  // 'new' does not require .creunarc.json
  const _messages = messages;
  const projectPath = path.join(process.cwd(), arg1 || '');

  appCreator
    .canWriteFiles(projectPath)
    .then(() => getNewAppInput())
    .then(answers =>
      appCreator.writeFiles(Object.assign({}, answers, { projectPath }))
    )
    .then(async ({ messages }) => {
      await maybeWriteVSCodeTasks(projectPath);

      _messages.emptyLine();
      _messages.messageList(messages);
      _messages.emptyLine();
    })
    .catch(messages.error);
} else if (Object.values(supportedCommands).includes(command)) {
  // All other commands require .creunarc.json to run
  getConfig()
    .then(({ componentsPath, eslintConfig, mockupPath }) => {
      if (command === supportedCommands.lib) {
        return lib(componentsPath);
      }

      const _messages = messages;
      return runReactScript({
        arg1,
        arg2,
        eslintConfig,
        command,
        componentsPath,
        mockupPath
      })
        .then(({ messages }) => {
          _messages.emptyLine();
          _messages.messageList(messages);
          _messages.emptyLine();
        })
        .catch(messages.error);
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

const latestVersion = configstore.get('latestVersion');
if (latestVersion && semver.gt(latestVersion, currentVersion)) {
  messages.emptyLine();
  messages.versionConflict(currentVersion, latestVersion);
  messages.emptyLine();
}

if (shouldExit) {
  process.exit(0);
}
