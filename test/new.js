const path = require('path');
const test = require('ava');

const runCreateApp = require('./utils/run-create-app');
const walkDirSync = require('./utils/walk-dir-sync');

test.cb('All options enabled', t => {
  t.plan(1);

  runCreateApp(new Array(9).fill('y')).then(buildPath => {
    const allFiles = walkDirSync(buildPath);

    t.snapshot(
      allFiles.map(filePath =>
        filePath.replace(new RegExp(`${path.sep}/g`), '/')
      )
    );
    t.end();
  });
});

test.cb('All options disabled', t => {
  t.plan(1);

  runCreateApp(new Array(9).fill('n')).then(buildPath => {
    const allFiles = walkDirSync(buildPath);

    t.snapshot(
      allFiles.map(filePath =>
        // Turn OS specific path separators into forward slashes so snapshots aren't broken on Windows
        filePath.replace(new RegExp(`${path.sep}/g`), '/')
      )
    );
    t.end();
  });
});
