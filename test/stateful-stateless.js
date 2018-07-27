const fs = require('fs');
const path = require('path');
const test = require('ava');

const getBinPath = require('./utils/get-bin-path');
const runCreateApp = require('./utils/run-create-app');
const runWithPrompt = require('./utils/run-with-prompt');

const template = async (t, answers, args = '') => {
  t.plan(3);

  const buildPath = await runCreateApp();

  // Create component to be converted
  await runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} component ${args}`,
    answers.concat('')
  );

  // Convert to stateful
  await runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} stateful ${args}`,
    answers
  );

  const componentPath = path.join(
    buildPath,
    'source',
    'components',
    'component',
    'component.jsx'
  );

  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'), 'To stateful');

  // Convert to stateless
  await runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} stateless ${args}`,
    answers
  );

  t.snapshot(fs.readFileSync(componentPath, 'utf-8'), 'To stateless');
};

test.serial('With prompt', template, ['component']);
test.serial('With arguments', template, [], 'component');
