/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const github = require('octonode');

const client = github.client();
const repo = client.repo('Creuna-Oslo/react-components');

module.exports = function(path) {
  return new Promise(resolve => {
    repo.contents(path, (err, response) => {
      if (err) {
        console.log(
          `🙀  ${chalk.redBright("Oh no! Couldn't get files!")}
This likely means that the hourly GitHub API quota has been exceeded.
You should let ${chalk.blueBright('asbjorn.hegdahl@creuna.no')} know ASAP.`
        );
        process.exit(1);
      }

      resolve(response);
    });
  });
};
