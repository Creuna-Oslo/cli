const messages = require('../../source/messages');

// Replaces entire messages with noops
module.exports = Object.keys(messages).reduce(
  (accum, key) =>
    Object.assign(accum, {
      [key]: () => {}
    }),
  {}
);
