const messages = require('../../source/messages');

// Replaces entire messages with noops, expect for error messages
module.exports = Object.entries(messages).reduce(
  (accum, [key, message]) =>
    Object.assign(accum, {
      [key]: key.toLowerCase().includes('error') ? message : () => {}
    }),
  {}
);
