const fs = require('fs');
const path = require('path');
const test = require('ava');

const getBinPath = require('./utils/get-bin-path');
const createMockApp = require('./utils/create-mock-app');
const runWithPrompt = require('./utils/run-with-prompt');

const template = async (t, command, answers, args = '') => {
  t.plan(2);

  const componentName = answers[0] || args;
  const buildPath = await createMockApp();

  // Convert to stateful
  await runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} ${command} ${args}`,
    answers
  );

  const componentPath = path.join(
    buildPath,
    'source',
    'components',
    componentName,
    `${componentName}.jsx`
  );

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test.serial('To stateless with prompt', template, 'stateless', [
  'component-stateful'
]);
test.serial(
  'To stateless with arguments',
  template,
  'stateless',
  [],
  'component-stateful'
);

test.serial('To stateful with prompt', template, 'stateful', [
  'component-stateless'
]);
test.serial(
  'To stateful with arguments',
  template,
  'stateful',
  [],
  'component-stateless'
);
