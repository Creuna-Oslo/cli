const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const prompt = require('@creuna/prompt');

const emoji = require('./emoji');
const messages = require('./messages');

const getNewAppInput = () => {
  return prompt({
    projectName: `${emoji('🚀')} Project name (kebab-case)`,
    authorName: `${emoji('😸')} Your full name`,
    authorEmail: `${emoji('💌')} Your email address`,
    useApiHelper: {
      text: `${emoji('☁️')} Include API-helper?`,
      type: Boolean
    },
    useMessenger: {
      text: `${emoji('💬')} Include message helper for API?`,
      type: Boolean
    },
    useAnalyticsHelper: {
      text: `${emoji('📈')} Include Analytics helper?`,
      type: Boolean
    },
    useResponsiveImages: {
      text: `${emoji('🖼️')} Include responsive images helper?`,
      type: Boolean
    },
    shouldWriteVSCodeTasks: {
      text: `${emoji('💻')} Include VS Code shortcuts for react scripts?`,
      type: Boolean
    }
  });
};

module.exports = async projectPath => {
  const appCreator = require('@creuna/create-react-app');

  try {
    await appCreator.canWriteFiles(projectPath);

    const answers = await getNewAppInput();
    const response = await appCreator.writeFiles(
      Object.assign({}, answers, { projectPath })
    );

    if (answers.shouldWriteVSCodeTasks) {
      fsExtra.ensureDirSync(path.join(projectPath, '.vscode'));
      fs.copyFileSync(
        path.join(__dirname, 'tasks.json'),
        path.join(projectPath, '.vscode', 'tasks.json')
      );
    }

    const creunaRcContent = {
      componentsPath: 'source/components',
      staticSitePath: 'source/static-site/pages',
      dataFileContent: '{}',
      dataFileExtension: 'json'
    };

    fs.writeFileSync(
      path.join(projectPath, '.creunarc.json'),
      JSON.stringify(creunaRcContent, null, 2)
    );

    messages.emptyLine();
    messages.messageList(response.messages);
    messages.emptyLine();
  } catch (error) {
    messages.error(error);
  }
};
