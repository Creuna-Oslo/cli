const path = require('path');
const prompt = require('@creuna/prompt');

const getComponentPath = require('./utils/get-component-path');
const messages = require('./messages');
const supportedCommands = require('./supported-commands');

function runScript({
  dataFileExtension,
  dataFileContent,
  command,
  componentsPath,
  eslintConfig,
  shellArguments,
  staticSitePath,
  staticPageTemplate
}) {
  const { pathOrName } = prompt({
    pathOrName: {
      text:
        command === supportedCommands.page
          ? 'Name of page'
          : 'Name of component',
      value: shellArguments[0]
    }
  });

  const { groupName, humanReadableName, pageUrl } =
    command === supportedCommands.page
      ? prompt({
          humanReadableName: {
            text: 'Human readable name (optional)',
            optional: true,
            value: shellArguments[1]
          },
          groupName: {
            text: 'Group name for the index page (optional)',
            optional: true,
            value: shellArguments[2]
          },
          pageUrl: {
            text: 'Custom url for the page (optional)',
            optional: true,
            value: shellArguments[3]
          }
        })
      : {};

  const { newComponentName } =
    command === supportedCommands.rename
      ? prompt({
          newComponentName: {
            text: 'New name of component',
            value: shellArguments[1]
          }
        })
      : {};

  const {
    newComponent,
    newPage,
    rename,
    toStateful,
    toStateless
  } = require('@creuna/react-scripts');

  const isPath = pathOrName.includes(path.sep);
  const componentName = path.basename(pathOrName, path.extname(pathOrName));
  const pageBasePath = isPath
    ? path.join(staticSitePath, path.dirname(pathOrName))
    : staticSitePath;
  const componentBasePath = isPath
    ? path.join(componentsPath, path.dirname(pathOrName))
    : componentsPath;

  switch (command) {
    case supportedCommands.component:
      return newComponent({
        componentName,
        eslintConfig,
        folderPath: componentBasePath
      });
    case supportedCommands.page:
      return newPage({
        componentName,
        dataFileContent,
        dataFileExtension,
        eslintConfig,
        folderPath: pageBasePath,
        groupName,
        humanReadableName,
        template: staticPageTemplate,
        url: pageUrl
      });
    case supportedCommands.rename:
      return rename({
        eslintConfig,
        filePath: getComponentPath({ basePath: componentsPath, pathOrName }),
        newComponentName
      });
    case supportedCommands.stateful:
      return toStateful({
        eslintConfig,
        filePath: getComponentPath({ basePath: componentsPath, pathOrName })
      });
    case supportedCommands.stateless:
      return toStateless({
        eslintConfig,
        filePath: getComponentPath({ basePath: componentsPath, pathOrName })
      });
  }
}

module.exports = function(options) {
  return runScript(options)
    .then(response => {
      messages.emptyLine();
      messages.messageList(response.messages);
      messages.emptyLine();
    })
    .catch(messages.error);
};
