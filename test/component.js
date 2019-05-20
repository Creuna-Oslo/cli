const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

test('Creates component', async t => {
  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, { pathOrName: 'component' }),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();

  const componentsPath = path.join(buildPath, 'source', 'components');
  const componentPath = path.join(componentsPath, 'component', 'component.jsx');

  await runReactScript({
    command: 'component',
    componentsPath,
    shellArguments: []
  });

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
});
