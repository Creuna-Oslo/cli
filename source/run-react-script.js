const path = require('path');
const prompt = require('@creuna/prompt');
const {
  newComponent,
  newPage,
  rename,
  toStateful,
  toStateless
} = require('@creuna/react-scripts');

const getComponentPath = require('./utils/get-component-path');
const supportedCommands = require('./supported-commands');

module.exports = function({
  arg1,
  arg2,
  eslintConfig,
  command,
  componentsPath,
  mockupPath
}) {
  const { pathOrName } = prompt({
    pathOrName: {
      text:
        command === supportedCommands.page
          ? 'Name of page'
          : 'Name of component',
      value: arg1
    }
  });

  const { shouldBeStateful } =
    command === supportedCommands.component
      ? prompt({
          shouldBeStateful: {
            text: 'Should the component be stateful?',
            type: Boolean,
            value: arg2 === '-s' ? true : undefined
          }
        })
      : {};

  const { humanReadableName } =
    command === supportedCommands.page
      ? prompt({
          humanReadableName: {
            text: 'Human readable name (optional)',
            optional: true,
            value: arg2
          }
        })
      : {};

  const { newComponentName } =
    command === supportedCommands.rename
      ? prompt({
          newComponentName: {
            text: 'New name of component',
            value: arg2
          }
        })
      : {};

  const isPath = pathOrName.includes(path.sep);
  const componentName = path.basename(pathOrName, path.extname(pathOrName));
  const pageBasePath = isPath
    ? path.join(mockupPath, path.dirname(pathOrName))
    : mockupPath;
  const componentBasePath = isPath
    ? path.join(componentsPath, path.dirname(pathOrName))
    : componentsPath;

  switch (command) {
    case supportedCommands.component:
      return newComponent({
        componentName,
        eslintConfig,
        folderPath: componentBasePath,
        shouldBeStateful
      });
    case supportedCommands.page:
      return newPage({
        componentName,
        eslintConfig,
        folderPath: pageBasePath,
        humanReadableName
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
};
