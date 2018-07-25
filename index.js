#!/usr/bin/env node
/* eslint-env node */
const commandSwitch = require('./source/commands').commandSwitch;
const messages = require('./source/messages');
const fetchLatestVersion = require('./source/fetch-latest-version');
const currentVersion = require('./source/get-this-version');
const semver = require('semver');
const configstore = require('./source/configstore');

(() => {
  fetchLatestVersion();

  // this should really be using minimist, eventually
  const [path, node, command, ...rest] = process.argv;
  if (rest.includes('--version') || rest.includes('-v')) {
    messages.version(currentVersion);
    process.exit(0);
  }

  commandSwitch(command, ...rest);

  const latestVersion = configstore.get('latestVersion');
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    messages.emptyLine();
    messages.versionConflict(currentVersion, latestVersion);
    messages.emptyLine();
  }
})();
