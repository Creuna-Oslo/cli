/* eslint-env node */
const currentVersion = require('./source/get-this-version');
const messages = require('./source/messages');

const path = require('path');
const semver = require('semver');

const clearGitHubCredentials = require('./source/clear-github-credentials');
const configstore = require('./source/configstore');
const fetchLatestVersion = require('./source/fetch-latest-version');
const getConfig = require('./source/get-config');
const lib = require('./source/get-components-from-library');
const maybeWriteVSCodeTasks = require('./source/maybe-write-vscode-tasks');
const newApp = require('./source/new-app');
const runReactScript = require('./source/run-react-script');
const supportedCommands = require('./source/supported-commands');

module.exports = function(command, arg1, arg2) {
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

      if (command === supportedCommands.logout) {
        clearGitHubCredentials();
        messages.clearedGitHubCredentials();
        return;
      }

      if (command === supportedCommands.new) {
        const projectPath = path.join(process.cwd(), arg1 || '');

        return newApp(projectPath)
          .then(response => {
            maybeWriteVSCodeTasks(projectPath);

            messages.emptyLine();
            messages.messageList(response.messages);
            messages.emptyLine();
          })
          .catch(messages.error);
      }

      // If the command isn't 'new', 'lib' or 'logout', the command is a @creuna/react-scripts command.
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
};
