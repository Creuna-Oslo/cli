const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

const template = async (t, answers, shellArguments = '') => {
  t.plan(2);

  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();

  const componentsPath = path.join(buildPath, 'source', 'components');
  const componentPath = path.join(
    componentsPath,
    'new-component',
    'new-component.jsx'
  );

  await runReactScript({
    command: 'rename',
    componentsPath,
    shellArguments
  });

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test('With prompt', template, {
  pathOrName: 'component-stateful',
  newComponentName: 'new-component'
});
test('With arguments', template, {}, ['component-stateful', 'new-component']);
