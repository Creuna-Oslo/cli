const path = require('path');
const test = require('ava');
const tempy = require('tempy');

const getBinPath = require('./utils/get-bin-path');
const runWithPrompt = require('./utils/run-with-prompt');
const walkDirSync = require('./utils/walk-dir-sync');

const template = (t, answers) => {
  t.plan(1);

  const buildPath = tempy.directory();

  runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} new`,
    answers
  ).then(() => {
    const allFiles = walkDirSync(buildPath);

    t.snapshot(
      allFiles.map(filePath =>
        filePath.replace(new RegExp(`${path.sep}/g`), '/')
      )
    );
    t.end();
  });
};

test.serial.cb('All options enabled', template, new Array(9).fill('y'));
test.serial.cb('All options disabled', template, new Array(9).fill('n'));
