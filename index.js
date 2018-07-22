#!/usr/bin/env node
/* eslint-env node */

const semver = require('semver');

const configstore = require('./source/configstore');
const currentVersion = require('./source/get-this-version');
const fetchLatestVersion = require('./source/fetch-latest-version');
const getConfig = require('./source/get-config');
const lib = require('./source/get-components-from-library');
const runReactScript = require('./source/run-react-script');
const commandSwitch = require('./source/commands').commandSwitch;

fetchLatestVersion();
const latestVersion = configstore.get('latestVersion');
if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    messages.emptyLine();
    messages.versionConflict(currentVersion, latestVersion);
    messages.emptyLine();
}

let main = (() => {
    // this should really be using minimist, eventually
    const [command, arg1, arg2] = process.argv.slice(2);
    commandSwitch(command, arg1, arg2);
})();
