const dns = require('dns');

// Checks if domain is available
module.exports = function(url) {
  return new Promise(resolve => {
    dns.resolve(url, err => (err ? resolve(false) : resolve(true)));
  });
};
