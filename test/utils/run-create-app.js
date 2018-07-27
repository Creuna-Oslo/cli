const { EOL } = require('os');
const path = require('path');
const tempy = require('tempy');

const exec = require('./exec');

module.exports = (answers = new Array(9).fill('y')) =>
  new Promise(res => {
    const answersStack = answers.reverse();
    const buildPath = tempy.directory();
    const binPath = path.relative(buildPath, `${__dirname}/../../index.js`);

    const childProcess = exec(`cd ${buildPath} && node ${binPath} new`);
    const { stdin, stdout } = childProcess;

    stdout.on('data', data => {
      // Every time that prompt prints a question, this callback will run. We can then pass input to the prompt by writing to stdin.

      // Hacky, I know...
      if (!data.includes('All done!')) {
        // Pass input to the prompt. End of line character is needed in order to "finish" input and make script continue
        stdin.write(`${answersStack.pop()}${EOL}`);
      } else {
        childProcess.kill();
        res(buildPath);
      }
    });
  });
