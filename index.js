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
const newApp = require('./source/new-app');
const runReactScript = require('./source/run-react-script');
const supportedCommands = require('./source/supported-commands');

module.exports = function({ cwd = process.cwd(), command, shellArguments }) {
  fetchLatestVersion();

  let shouldExit = false;

  if (!command) {
    shouldExit = true;
  } else if (Object.values(supportedCommands).includes(command)) {
    if (command === supportedCommands.logout) {
      clearGitHubCredentials();
      messages.clearedGitHubCredentials();
      return;
    }

    if (command === supportedCommands.new) {
      const projectPath = path.join(cwd, shellArguments[0] || '');

      return newApp(projectPath);
    }

    const {
      componentsPath,
      dataFileContent,
      dataFileExtension,
      eslintConfig,
      staticSitePath
    } = getConfig(cwd);

    if (command === supportedCommands.lib) {
      return lib(componentsPath);
    }

    // If the command isn't 'new', 'lib' or 'logout', the command is a @creuna/react-scripts command.
    return runReactScript({
      command,
      componentsPath,
      dataFileContent,
      dataFileExtension,
      eslintConfig,
      shellArguments,
      staticSitePath
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
};
