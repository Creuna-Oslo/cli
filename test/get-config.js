const path = require('path');
const test = require('ava');

const getConfig = require('../source/get-config');
const eslintConfig = require('./fixtures/app/.eslintrc.json');
const creunaConfig = require('./fixtures/app/.creunarc.json');

const appPath = path.join(__dirname, 'fixtures', 'app');

test('Fixture app config', t => {
  const config = getConfig(appPath);

  const expectedConfig = {
    ...creunaConfig,
    eslintConfig,
    componentsPath: path.join(appPath, 'source', 'components'),
    mockupPath: path.join(appPath, 'source', 'mockup', 'pages')
  };

  t.deepEqual(expectedConfig, config);
});
