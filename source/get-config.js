/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const findUp = require('find-up');
const path = require('path');

const red = chalk.redBright;

// Traverse up the folder tree, trying to find config files
module.exports = function() {
  return findUp('.creunarc.json').then(filePath => {
    if (filePath) {
      const { componentsPath, mockupPath } = require(path.relative(
        __dirname,
        filePath
      ));
      const projectRoot = filePath.substring(0, filePath.lastIndexOf(path.sep));

      return {
        componentsPath: path.join(projectRoot, componentsPath),
        mockupPath: path.join(projectRoot, mockupPath)
      };
    } else {
      console.log(
        `😱  ${red('No')} .creunarc.json' ${red(
          'file found. Check the readme'
        )}`
      );
      process.exit(1);
    }
  });
};
