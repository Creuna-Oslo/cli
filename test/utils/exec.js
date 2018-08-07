const { exec } = require('child_process');

// Abstraction of exec that adds error logging. Without this logging debugging failing tests can quickly become a nightmare
module.exports = command => {
  const childProcess = exec(command);
  const { stdin, stdout, stderr } = childProcess;

  stdout.setEncoding = 'utf-8';
  stderr.setEncoding = 'utf-8';
  stdin.setDefaultEncoding = 'utf-8';

  childProcess.on('error', error => {
    console.log(error);
  });

  stderr.on('data', data => {
    console.log(data);
  });

  return childProcess;
};
