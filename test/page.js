const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

const template = async (t, answers, args = []) => {
  t.plan(2);

  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();

  const mockupPath = path.join(buildPath, 'source', 'mockup', 'pages');
  const pagePath = path.join(mockupPath, 'new-page', 'new-page.jsx');

  await runReactScript({
    arg1: args[0],
    arg2: args[1],
    command: 'page',
    mockupPath
  });

  t.is(fs.existsSync(pagePath), true);
  t.snapshot(fs.readFileSync(pagePath, 'utf-8'));
};

test('With prompt', template, {
  pathOrName: 'new-page',
  humanReadableName: 'New/page'
});
test('With arguments', template, {}, ['new-page', 'New/page']);
