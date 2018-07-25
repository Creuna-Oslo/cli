const appCreator = require('@creuna/create-react-app');
const maybeWriteVSCodeTasks = require('../../maybe-write-vscode-tasks');
const getNewAppInput = require('../../get-new-app-input');
const path = require('path');
const messages = require('../../messages');

let createApp = userPath => {
  const projectPath = path.join(process.cwd(), userPath || '');

  appCreator
    .canWriteFiles(projectPath)
    .then(() => getNewAppInput())
    .then(answers =>
      appCreator.writeFiles(Object.assign({}, answers, { projectPath }))
    )
    .then(async output => {
      await maybeWriteVSCodeTasks(projectPath);

      messages.emptyLine();
      messages.messageList(output.messages);
      messages.emptyLine();
    })
    .catch(messages.error);
};

module.exports = createApp;
