const path = require('path');
const test = require('ava');

const runCreateApp = require('./utils/run-create-app');
const walkDirSync = require('./utils/walk-dir-sync');

const template = (t, answers) => {
  t.plan(1);

  runCreateApp(answers).then(buildPath => {
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
