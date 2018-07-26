/* eslint-env node */
const { ensureDirSync } = require('fs-extra');
const fs = require('fs');
const path = require('path');

const canConnect = require('./../../can-connect');
const messages = require('./../../messages');
const selectComponents = require('./../../select-components');
const readGhPath = require('./../../read-github-path');

module.exports = async function(config) {
  let localComponentsPath = config.componentsPath;
  messages.emptyLine();
  messages.searchingForComponents();

  const canConnectToGitHub = await canConnect('www.github.com');

  if (!canConnectToGitHub) {
    messages.gitHubRequestTimeout();
    messages.emptyLine();
    process.exit(1);
  }

  const componentNames = await readGhPath('components').then(componentPaths =>
    // Remove first slug ('components/')
    componentPaths.map(({ path }) => path.substring(path.indexOf('/') + 1))
  );

  const selectedComponents = await selectComponents(componentNames);

  messages.emptyLine();

  if (selectedComponents.length === 0) {
    messages.noComponentsSelected();
    process.exit(1);
  }

  const filteredComponents = selectedComponents.filter(componentName => {
    if (fs.existsSync(path.join(localComponentsPath, componentName))) {
      messages.componentAlreadyExists(componentName);
      return false;
    }
    return true;
  }, []);

  if (filteredComponents.length === 0) {
    messages.noComponentsToWrite();
    messages.emptyLine();
    process.exit(0);
  }

  const filteredPaths = filteredComponents.map(name => `components/${name}`);

  messages.downloadingComponents();

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

  messages.writingFiles();

  allFiles.forEach(file => {
    if (!file) {
      messages.missingFile();
      return;
    }
    const content = file.content;
    const filePath = path.join(
      localComponentsPath,
      file.path.replace('/', path.sep)
    );
    const directory = filePath.substring(0, filePath.lastIndexOf(path.sep));
    ensureDirSync(directory);
    fs.writeFileSync(filePath, content);
  });

  messages.componentsAdded();

  process.exit(0);
};
