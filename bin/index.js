#!/usr/bin/env node
/* eslint-env node */
const currentVersion = require('../source/get-this-version');
const messages = require('../source/messages');
const run = require('../index');

// eslint-disable-next-line
const [nodeJsPath, binPath, command, arg1, arg2] = process.argv;

// The following two blocks are placed here in order to ensure fast shell output for 'creuna' and 'creuna -v'. (Node.js spends a small eternity importing and parsing the dependencies in ../index.js).
if (!command) {
  messages.help();
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  messages.version(currentVersion);
  process.exit(0);
}

run(command, arg1, arg2);
