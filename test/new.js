const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');
const tempy = require('tempy');

const mockPrompt = require('./utils/mock-prompt');
const mockMessages = require('./utils/mock-messages');
const walkDirSync = require('./utils/walk-dir-sync');

const template = async (t, answers) => {
  t.plan(1);

  const newApp = proxyquire('../source/new-app', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = tempy.directory();

  await newApp(buildPath);
  const allFiles = walkDirSync(buildPath);

  t.snapshot(
    allFiles.map(filePath => filePath.replace(new RegExp(`${path.sep}/g`), '/'))
  );
};

test('All options enabled', template, {
  projectName: 'project',
  authorName: 'author',
  authorEmail: 'email',
  useApiHelper: true,
  useMessenger: true,
  useAnalyticsHelper: true,
  useResponsiveImages: true,
  shouldWriteVSCodeTasks: true
});
test('All options disabled', template, {
  projectName: 'project',
  authorName: 'author',
  authorEmail: 'email',
  useApiHelper: false,
  useMessenger: false,
  useAnalyticsHelper: false,
  useResponsiveImages: false,
  shouldWriteVSCodeTasks: false
});
