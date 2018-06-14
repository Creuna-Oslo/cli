/* eslint-env node */
const github = require('octonode');

const messages = require('./messages');

const client = github.client();
const repo = client.repo('Creuna-Oslo/react-components');

module.exports = function(path) {
  return new Promise(resolve => {
    repo.contents(path, (err, response) => {
      if (err) {
        messages.githubReadError();
        process.exit(1);
      }

      resolve(response);
    });
  });
};
