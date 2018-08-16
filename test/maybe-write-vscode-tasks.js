const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const createMockApp = require('./utils/create-mock-app');
const mockPrompt = require('./utils/mock-prompt');

const template = async (t, shouldWriteVSCodeTasks) => {
  t.plan(1);

  const maybeWriteVsCodeTasks = proxyquire(
    '../source/maybe-write-vscode-tasks',
    {
      '@creuna/prompt': mockPrompt.bind(null, { shouldWriteVSCodeTasks })
    }
  );

  const buildPath = await createMockApp();

  await maybeWriteVsCodeTasks(buildPath);

  t.is(
    fs.existsSync(path.join(buildPath, '.vscode', 'tasks.json')),
    shouldWriteVSCodeTasks
  );
};

test('Writes tasks.json', template, true);
test("Doesn't write tasks.json", template, false);
