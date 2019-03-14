/* eslint-env node */
const path = require('path');

const checkVersion = require('./source/check-version');
const clearGitHubCredentials = require('./source/clear-github-credentials');
const fetchLatestVersion = require('./source/fetch-latest-version');
const getConfig = require('./source/get-config');
const jobApply = require('./source/job-apply');
const lib = require('./source/get-components-from-library');
const messages = require('./source/messages');
const newApp = require('./source/new-app');
const runReactScript = require('./source/run-react-script');
const supportedCommands = require('./source/supported-commands');

const reactScripts = [
  supportedCommands.stateful,
  supportedCommands.stateless,
  supportedCommands.page,
  supportedCommands.component,
  supportedCommands.rename
];

module.exports = function({ cwd = process.cwd(), command, shellArguments }) {
  if (!reactScripts.includes(command)) {
    fetchLatestVersion();
  }

  if (!Object.values(supportedCommands).includes(command)) {
    messages.unrecognizedCommand(command);
    messages.help();
    return;
  }

  if (command === supportedCommands.job) {
    jobApply(...shellArguments);
    return;
  }

  if (command === supportedCommands.logout) {
    clearGitHubCredentials();
    messages.clearedGitHubCredentials();
    return;
  }

  if (command === supportedCommands.new) {
    const projectPath = path.join(cwd, shellArguments[0] || '');
    newApp(projectPath);
    return;
  }

  const [
    {
      componentsPath,
      dataFileContent,
      dataFileExtension,
      eslintConfig,
      staticSitePath
    },
    configError
  ] = getConfig(cwd);

  if (configError) {
    messages.error(configError.message);
    return;
  }

  if (command === supportedCommands.lib) {
    lib(componentsPath);
    return;
  }

  // If the command isn't 'new', 'lib' or 'logout', the command is a @creuna/react-scripts command.
  runReactScript({
    command,
    componentsPath,
    dataFileContent,
    dataFileExtension,
    eslintConfig,
    shellArguments,
    staticSitePath
  }).then(() => {
    checkVersion();
    process.exit(0);
  });
};
