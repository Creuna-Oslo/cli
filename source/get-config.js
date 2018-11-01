/* eslint-env node */
/* eslint-disable no-console */
const assert = require('assert');
const findUp = require('find-up');
const path = require('path');

// Traverse up the folder tree, trying to find config files
module.exports = function(cwd = process.cwd()) {
  const creunaRcPath = findUp.sync('.creunarc.json', { cwd });
  const eslintRcPath = findUp.sync('.eslintrc.json', { cwd });

  const eslintConfig =
    eslintRcPath && require(path.relative(__dirname, eslintRcPath));

  if (!creunaRcPath) {
    return [{ componentsPath: cwd, eslintConfig, staticSitePath: cwd }];
  }

  const projectRoot = path.dirname(creunaRcPath);
  const {
    componentsPath,
    staticSitePath,
    dataFileExtension,
    dataFileContent
  } = require(path.relative(__dirname, creunaRcPath));

  try {
    const errorFooter = `\nThis property is required when using a '.creunarc.json' file.`;
    assert(
      componentsPath,
      `No 'componentsPath' found in ${creunaRcPath}${errorFooter}`
    );
    assert(
      staticSitePath,
      `No 'staticSitePath' found in ${creunaRcPath}${errorFooter}`
    );
  } catch (error) {
    return [{}, error];
  }

  return [
    {
      componentsPath: path.join(projectRoot, componentsPath),
      staticSitePath: path.join(projectRoot, staticSitePath),
      dataFileContent,
      dataFileExtension,
      eslintConfig
    }
  ];
};
