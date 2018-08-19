const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

const template = async (t, answers = {}, args = []) => {
  t.plan(2);

  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();

  const componentsPath = path.join(buildPath, 'source', 'components');
  const componentPath = path.join(componentsPath, 'component', 'component.jsx');

  await runReactScript({
    arg1: args[0],
    arg2: args[1],
    command: 'component',
    componentsPath
  });

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test('Stateful component', template, {
  pathOrName: 'component',
  shouldBeStateful: true
});
test('Stateful component (arguments)', template, {}, ['component', '-s']);
test('Stateless component', template, {
  pathOrName: 'component',
  shouldBeStateful: false
});
