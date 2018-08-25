/* eslint-env node */
/* eslint-disable no-console */
const findUp = require('find-up');
const path = require('path');

// Traverse up the folder tree, trying to find config files
module.exports = function(cwd = process.cwd()) {
  const creunaRcPath = findUp.sync('.creunarc.json', { cwd });
  const eslintRcPath = findUp.sync('.eslintrc.json', { cwd });

  const eslintConfig =
    eslintRcPath && require(path.relative(__dirname, eslintRcPath));

  if (!creunaRcPath) {
    return { componentsPath: cwd, eslintConfig, mockupPath: cwd };
  }

  const projectRoot = path.dirname(creunaRcPath);
  const { componentsPath, mockupPath } = require(path.relative(
    __dirname,
    creunaRcPath
  ));

  return {
    componentsPath: path.join(projectRoot, componentsPath),
    mockupPath: path.join(projectRoot, mockupPath),
    eslintConfig
  };
};
