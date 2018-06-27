/* eslint-env node */

module.exports = function(emoji, fallback = '') {
  const emojiString = emoji ? `${emoji}  ` : '';

  return process.stdout.isTTY && process.platform === 'darwin'
    ? emojiString
    : `${fallback} `;
};
