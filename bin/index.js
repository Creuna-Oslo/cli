#!/usr/bin/env node
/* eslint-env node */
const currentVersion = require('../source/get-this-version');

// eslint-disable-next-line no-unused-vars
const [nodeJsPath, binPath, command, ...shellArguments] = process.argv;

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  // eslint-disable-next-line no-console
  console.log(currentVersion);
  process.exit(0);
}

// The following two blocks are placed here in order to ensure fast shell output for 'creuna' and 'creuna -v'. (Node.js spends a small eternity importing and parsing the dependencies in ../index.js).
if (!command) {
  const messages = require('../source/messages');
  messages.help();
  process.exit(0);
}

const run = require('../index');

run({ cwd: process.cwd(), command, shellArguments });
