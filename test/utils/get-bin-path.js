const path = require('path');

// Get the relative path to /index.js from currentPath
module.exports = currentPath =>
  path.relative(currentPath, `${__dirname}/../../index.js`);
