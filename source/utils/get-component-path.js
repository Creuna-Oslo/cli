/* eslint-env node */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const validatePaths = require('./validate-paths');

// This function tries to find a react component from a full path, or a path relative to 'basePath'
module.exports = function({ basePath, pathOrName }) {
  validatePaths({ basePath, pathOrName });

  // Path may not be OS compatible. Make sure it is:
  const normalizedPath = pathOrName.replace(/[/\\]+/g, path.sep);
  const pathWithoutExtension = normalizedPath.replace(/\.jsx$/, '');
  const pathWithExtension = `${normalizedPath}.jsx`;
  const baseName = path.basename(normalizedPath, '.jsx');
  const fileName = `${baseName}.jsx`;

  // List of possible paths for the jsx file. The first matching file will be used.
  const pathVariations = [
    normalizedPath,

    // component.jsx -> <basePath>/component.jsx
    path.join(basePath, normalizedPath),

    // component -> <basePath>/component.jsx
    path.join(basePath, pathWithExtension),

    // component.jsx -> <basePath>/component/component.jsx
    path.join(basePath, pathWithoutExtension, fileName)
  ];

  const filePath = pathVariations.find(
    filePath => fs.existsSync(filePath) && path.extname(filePath) === '.jsx'
  );

  if (filePath) {
    return filePath;
  }

  throw new Error(
    `Couldn't find component ${chalk.blueBright(path.basename(pathOrName))}.`
  );
};
