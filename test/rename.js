const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockPrompt = require('./utils/mock-prompt');

const template = async (t, answers, args = '') => {
  t.plan(2);

  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers)
  });

  const buildPath = await createMockApp();

  // This path is configured in .creunarc.json written by createMockApp
  const componentsPath = path.join(buildPath, 'source', 'components');
  const componentPath = path.join(
    componentsPath,
    'new-component',
    'new-component.jsx'
  );

  await runReactScript({
    arg1: args[0],
    arg2: args[1],
    command: 'rename',
    componentsPath
  });

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test('With prompt', template, {
  pathOrName: 'component-stateful',
  newComponentName: 'new-component'
});
test('With arguments', template, {}, ['component-stateful', 'new-component']);
