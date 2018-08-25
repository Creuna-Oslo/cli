const configstore = require('./configstore');
const { storageKeys } = require('./get-github-client');

module.exports = () => {
  Object.values(storageKeys).forEach(key => {
    configstore.delete(key);
  });
};
