#!/usr/bin/env node
/* eslint-env node */
const commandSwitch = require('./source/commands').commandSwitch;

(() => {
  // this should really be using minimist, eventually
  const [command, ...rest] = process.argv.slice(2);
  commandSwitch(command, ...rest);
})();
