/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const { ensureDirSync } = require('fs-extra');
const fs = require('fs');
const path = require('path');

const selectComponents = require('./select-components');
const readGhPath = require('./read-github-path');

module.exports = async function(localComponentsPath) {
  console.log('🕵  Finding components');

  const componentNames = await readGhPath('components').then(componentPaths =>
    // Remove first slug ('components/')
    componentPaths.map(({ path }) => path.substring(path.indexOf('/') + 1))
  );
  const selectedComponents = await selectComponents(componentNames);

  console.log(''); // Whitespace

  if (selectedComponents.length === 0) {
    console.log(chalk.redBright('No components selected. Exiting.'));
    process.exit(1);
  }

  const filteredComponents = selectedComponents.filter(componentName => {
    if (fs.existsSync(path.join(localComponentsPath, componentName))) {
      console.log(
        `☠️  ${componentName} ${chalk.redBright('already exists. Skipping.')}`
      );
      return false;
    }

    return true;
  }, []);

  if (filteredComponents.length === 0) {
    console.log(`😐  ${chalk.redBright('No components to write. Exiting')}`);
    process.exit(0);
  }

  const filteredPaths = filteredComponents.map(name => `components/${name}`);

  console.log('⬇️  Downloading components');

  const allFilePaths = await Promise.all(
    filteredPaths.map(componentPath => readGhPath(componentPath))
  ).then(components => [].concat(...components)); // Merge 2D array to single array

  const allFiles = await Promise.all(
    allFilePaths.map(file => readGhPath(file.path))
  ).then(filesData =>
    filesData.map(({ path, content }) => ({
      path: path && path.substring(path.indexOf('/') + 1), // remove first slug ('components/')
      content: content && new Buffer(content, 'base64').toString('utf-8')
    }))
  );

  console.log('💾  Writing files');

  allFiles.forEach(file => {
    if (!file) {
      console.log(chalk.redBright('⁉️  Missing file'));
      return;
    }

    const content = file.content;
    const filePath = path.join(
      localComponentsPath,
      file.path.replace('/', path.sep)
    );
    const directory = filePath.substring(0, filePath.lastIndexOf('/'));

    ensureDirSync(directory);

    fs.writeFileSync(filePath, content);
  });

  console.log('🎉  Components added!');

  process.exit(0);
};
