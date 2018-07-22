const prompt = require('@creuna/prompt');
const {
  newComponent,
  newPage,
  rename,
  toStateful,
  toStateless
} = require('@creuna/react-scripts');

const supportedCommands = require('./commands/command-list').supportedCommands;

module.exports = async function({
  arg1,
  arg2,
  eslintConfig,
  command,
  componentsPath,
  mockupPath
}) {
  const { pathOrName } = await prompt({
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
      ? await prompt({
          shouldBeStateful: {
            text: 'Should the component be stateful?',
            type: Boolean,
            value: process.argv.indexOf('-s') !== -1 ? true : undefined
          }
        })
      : {};

  const { humanReadableName } =
    command === supportedCommands.page
      ? await prompt({
          humanReadableName: {
            text: 'Human readable name (optional)',
            optional: true,
            value: arg2
          }
        })
      : {};

  const { newComponentName } =
    command === supportedCommands.rename
      ? await prompt({
          newComponentName: {
            text: 'New name of component',
            value: arg2
          }
        })
      : {};

  switch (command) {
    case supportedCommands.component:
      return newComponent({
        componentsPath,
        eslintConfig,
        pathOrName,
        shouldBeStateful
      });
    case supportedCommands.page:
      return newPage({
        componentName: pathOrName,
        eslintConfig,
        humanReadableName,
        mockupPath
      });
    case supportedCommands.rename:
      return rename({
        componentsPath,
        eslintConfig,
        pathOrName,
        newComponentName
      });
    case supportedCommands.stateful:
      return toStateful({ componentsPath, eslintConfig, pathOrName });
    case supportedCommands.stateless:
      return toStateless({ componentsPath, eslintConfig, pathOrName });
  }
};
