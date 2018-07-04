/* eslint-env node */
/* eslint-disable no-console */
const findUp = require('find-up');
const path = require('path');

// Traverse up the folder tree, trying to find config files
module.exports = function() {
  return Promise.all([
    findUp('.creunarc.json').then(filePath => {
      if (!filePath) {
        throw new Error('No .creunarc.json file found.');
      }

      const { componentsPath, mockupPath } = require(path.relative(
        __dirname,
        filePath
      ));
      const projectRoot = filePath.substring(0, filePath.lastIndexOf(path.sep));

      return {
        componentsPath: path.join(projectRoot, componentsPath),
        mockupPath: path.join(projectRoot, mockupPath)
      };
    }),
    findUp('.eslintrc.json').then(filePath => {
      if (filePath) {
        return require(path.relative(__dirname, filePath));
      }
    })
  ]).then(([{ componentsPath, mockupPath }, eslintConfig]) => ({
    componentsPath,
    mockupPath,
    eslintConfig
  }));
};
