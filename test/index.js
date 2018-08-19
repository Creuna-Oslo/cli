const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');

const creunaRc = require('./fixtures/app/.creunarc.json');
const eslintRc = require('./fixtures/app/.eslintrc.json');

test('Resolves creunarc and eslintrc', async (t, args = []) => {
  t.plan(3);

  const indexScript = proxyquire('../index', {
    './source/run-react-script': args => args
  });

  const buildPath = await createMockApp();

  const { componentsPath, eslintConfig, mockupPath } = await indexScript({
    arg1: args[0],
    arg2: args[1],
    command: 'component',
    cwd: buildPath
  });

  t.is(componentsPath, path.join(buildPath, creunaRc.componentsPath));
  t.is(mockupPath, path.join(buildPath, creunaRc.mockupPath));
  t.deepEqual(eslintConfig, eslintRc);
});
