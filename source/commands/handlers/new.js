const appCreator = require("@creuna/create-react-app");
const maybeWriteVSCodeTasks = require('../../maybe-write-vscode-tasks');
const getNewAppInput = require('../../get-new-app-input');
const path = require('path');
const messages = require('../../messages');

let createApp = userPath => {
  const projectPath = path.join(process.cwd(), userPath || "");
  console.log("appCreator", appCreator)
  appCreator
    .canWriteFiles(projectPath)
    .then(() => getNewAppInput())
    .then(answers =>
      appCreator.writeFiles(Object.assign({}, answers, { projectPath }))
    )
    .then(async output => {
      await maybeWriteVSCodeTasks(projectPath);

      output.messages.emptyLine();
      output.messages.messageList(messages);
      output.messages.emptyLine();
    })
    .catch(messages.error);
};

module.exports = createApp;