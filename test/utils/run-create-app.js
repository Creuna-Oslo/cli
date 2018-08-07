const tempy = require('tempy');

const getBinPath = require('./get-bin-path');
const runWithPrompt = require('./run-with-prompt');

module.exports = (answers = new Array(9).fill('y')) =>
  new Promise(res => {
    const buildPath = tempy.directory();
    const binPath = getBinPath(buildPath);

    runWithPrompt(`cd ${buildPath} && node ${binPath} new`, answers).then(
      () => {
        res(buildPath);
      }
    );
  });
