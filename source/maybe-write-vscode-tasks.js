const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const prompt = require('@creuna/prompt');

const emoji = require('./emoji');

module.exports = function(buildPath) {
  return new Promise(async resolve => {
    const { shouldWriteVSCodeTasks } = await prompt({
      shouldWriteVSCodeTasks: {
        text: `${emoji('💻')} Include VS Code shortcuts for react scripts?`,
        type: Boolean
      }
    });

    if (shouldWriteVSCodeTasks) {
      fsExtra.ensureDirSync(path.join(buildPath, '.vscode'));
      fs.copyFileSync(
        path.join(__dirname, 'tasks.json'),
        path.join(buildPath, '.vscode', 'tasks.json')
      );
    }

    return resolve();
  });
};
