/* eslint-env node */
const messages = require('./messages');

module.exports = function(repo, path) {
  return new Promise(resolve => {
    repo.contents(path, (error, response) => {
      if (error) {
        messages.gitHubReadError(error);
        process.exit(1);
      }

      resolve(response);
    });
  });
};
