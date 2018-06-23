/* eslint-env node */

module.exports = function(emoji, fallback = '') {
  return process.stdout.isTTY && process.platform === 'darwin'
    ? emoji
      ? `${emoji} `
      : ''
    : fallback;
};
