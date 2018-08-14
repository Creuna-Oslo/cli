/* eslint-env node */
const { ensureDirSync } = require('fs-extra');
const fs = require('fs');
const path = require('path');

const canConnect = require('./can-connect');
const { getGitHubClient } = require('./get-github-client');
const messages = require('./messages');
const selectComponents = require('./select-components');
const readGhPath = require('./read-github-path');

const getRemainingAPIUsage = client =>
  new Promise(resolve => {
    client.limit((error, left, max, reset) => {
      resolve({ requestsLeft: left, resetTime: reset });
    });
  });

module.exports = async function(localComponentsPath) {
  const canConnectToGitHub = await canConnect('www.github.com');

  if (!canConnectToGitHub) {
    messages.gitHubRequestTimeout();
    messages.emptyLine();
    return;
  }

  try {
    messages.connectingToGitHub();
    messages.emptyLine();

    const client = await getGitHubClient();
    const { requestsLeft, resetTime } = await getRemainingAPIUsage(client);

    if (requestsLeft === 0) {
      messages.githubRateLimitExceeded(resetTime);
      return;
    }

    const repo = client.repo('Creuna-Oslo/react-components');

    messages.searchingForComponents();

    // Get names of available components from directory names in the 'components' folder in the repository
    const componentNames = await readGhPath(repo, 'components').then(
      componentPaths =>
        // Remove first slug ('components/')
        componentPaths.map(({ path }) => path.substring(path.indexOf('/') + 1))
    );

    // Get selected components from user input (checkboxes)
    const selectedComponents = await selectComponents(componentNames);

    messages.emptyLine();

    if (selectedComponents.length === 0) {
      messages.noComponentsSelected();
      return;
    }

    // Filter out components that already exists on disk
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
      return;
    }

    const filteredPaths = filteredComponents.map(name => `components/${name}`);

    messages.downloadingComponents();

    // Get list of file paths for all filtered components
    const allFilePaths = await Promise.all(
      filteredPaths.map(componentPath => readGhPath(repo, componentPath))
    ).then(components => [].concat(...components)); // Merge 2D array to single array

    // Get file contents for all file paths
    const allFiles = await Promise.all(
      allFilePaths.map(file => readGhPath(repo, file.path))
    ).then(filesData =>
      filesData.map(({ path, content }) => ({
        path: path && path.substring(path.indexOf('/') + 1), // remove first slug ('components/')
        content: content && new Buffer(content, 'base64').toString('utf-8')
      }))
    );

    messages.writingFiles();

    // Write files to disk
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
  } catch (error) {
    messages.error(error);
  }
};
