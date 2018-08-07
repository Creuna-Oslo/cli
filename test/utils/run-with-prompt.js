const { EOL } = require('os');

const exec = require('./exec');

module.exports = (command, answers = []) =>
  new Promise(res => {
    const answersStack = answers.reverse();

    const childProcess = exec(command);
    const { stdin, stdout } = childProcess;

    const onData = () => {
      if (answersStack.length) {
        // Pass input to the prompt. End of line character is needed in order to "finish" input and make script continue
        stdin.write(`${answersStack.pop()}${EOL}`);
      } else {
        stdout.removeListener('data', onData);
        childProcess.kill();
        res();
      }
    };

    stdout.on('data', onData);
  });
