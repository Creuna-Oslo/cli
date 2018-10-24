const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

const createPage = async (answers, args = [], options) => {
  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();
  const staticSitePath = path.join(buildPath, 'source', 'static-site', 'pages');

  await runReactScript({
    ...options,
    arg1: args[0],
    arg2: args[1],
    command: 'page',
    staticSitePath
  });

  return staticSitePath;
};

test('With prompt', async t => {
  t.plan(2);

  const staticSitePath = await createPage({
    pathOrName: 'new-page',
    humanReadableName: 'New/page'
  });

  const pagePath = path.join(staticSitePath, 'new-page', 'new-page.jsx');

  t.is(fs.existsSync(pagePath), true);
  t.snapshot(fs.readFileSync(pagePath, 'utf-8'));
});

test('With arguments', async t => {
  t.plan(2);

  const staticSitePath = await createPage({}, ['new-page', 'New/page']);
  const pagePath = path.join(staticSitePath, 'new-page', 'new-page.jsx');

  t.is(true, fs.existsSync(pagePath));
  t.snapshot(fs.readFileSync(pagePath, 'utf-8'));
});

test('With custom data file extension', async t => {
  const staticSitePath = await createPage({}, ['new-page'], {
    dataFileExtension: 'js'
  });

  const dataFilePath = path.join(staticSitePath, 'new-page', 'new-page.js');

  t.is(true, fs.existsSync(dataFilePath));
});

test('With custom data file extension and content', async t => {
  t.plan(2);

  const staticSitePath = await createPage({}, ['new-page'], {
    dataFileExtension: 'js',
    dataFileContent: 'export default { a: 1 };'
  });

  const dataFilePath = path.join(staticSitePath, 'new-page', 'new-page.js');

  t.is(true, fs.existsSync(dataFilePath));
  t.is('export default { a: 1 };', fs.readFileSync(dataFilePath, 'utf-8'));
});
