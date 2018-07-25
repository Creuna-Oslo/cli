/* eslint-disable no-use-before-define */
/* eslint-env node*/
const messages = require('../messages');
const { supportedCommands } = require('./command-list');

const withDefaultMessages = commands => f => (...args) => {
  let command = args[0];
  let valids = args.filter(e => e !== undefined);
  let valid = commands.hasOwnProperty(command);
  if (valids.length === 0) {
    messages.help(commands);
    return;
  } else if (!valid) {
    messages.unrecognizedCommand(command);
    messages.help(commands);
    return;
  }

  return f(...valids);
};

let commandSwitch = withDefaultMessages(supportedCommands)(
  (command, ...rest) => {
    supportedCommands[command].handler(...rest);
  }
);

module.exports = { supportedCommands, commandSwitch };
