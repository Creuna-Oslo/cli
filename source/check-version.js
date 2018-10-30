const configstore = require('./configstore');
const semver = require('semver');

const currentVersion = require('./get-this-version');
const messages = require('./messages');

module.exports = () => {
  const latestVersion = configstore.get('latestVersion');
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    messages.emptyLine();
    messages.versionConflict(currentVersion, latestVersion);
    messages.emptyLine();
  }
};
