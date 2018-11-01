const path = require('path');
const test = require('ava');

const getConfig = require('../source/get-config');
const eslintConfig = require('./fixtures/app/.eslintrc.json');
const creunaConfig = require('./fixtures/app/.creunarc.json');

test('Fixture app config', t => {
  const appPath = path.join(__dirname, 'fixtures', 'app');
  const [config] = getConfig(appPath);

  const expectedConfig = {
    ...creunaConfig,
    eslintConfig,
    componentsPath: path.join(appPath, 'source', 'components'),
    staticSitePath: path.join(appPath, 'source', 'static-site', 'pages')
  };

  t.deepEqual(expectedConfig, config);
});

test('Bad creunarc config', t => {
  const appPath = path.join(__dirname, 'fixtures', 'bad-creunarc-app');
  const [, error] = getConfig(appPath);

  t.is(
    `No 'staticSitePath' found in ${appPath}/.creunarc.json\nThis property is required when using a '.creunarc.json' file.`,
    error.message
  );
});
