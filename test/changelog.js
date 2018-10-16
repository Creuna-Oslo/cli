const fs = require('fs');
const path = require('path');
const test = require('ava');

const packageJson = require('../package.json');
const { version } = packageJson;

test('Changelog has entry for current version', t => {
  t.plan(2);

  const changelogPath = path.resolve(__dirname, '..', 'CHANGELOG.md');

  t.is(true, fs.existsSync(changelogPath));

  const changelog = fs.readFileSync(
    path.resolve(__dirname, '..', 'CHANGELOG.md'),
    'utf8'
  );

  t.is(true, changelog.includes(`# ${version}`));
});
