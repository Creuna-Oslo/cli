const fs = require('fs');
const path = require('path');
const test = require('ava');

const getBinPath = require('./utils/get-bin-path');
const runCreateApp = require('./utils/run-create-app');
const runWithPrompt = require('./utils/run-with-prompt');

const template = async (t, answers, args = '') => {
  t.plan(2);

  const buildPath = await runCreateApp();

  await runWithPrompt(
    `cd ${buildPath} && node ${getBinPath(buildPath)} rename ${args}`,
    answers
  );

  const componentPath = path.join(
    buildPath,
    'source',
    'components',
    'new-component',
    'new-component.jsx'
  );
  t.is(fs.existsSync(componentPath), true);
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test.serial('With prompt', template, ['image', 'new-component']);
test.serial('With arguments', template, [], 'image new-component');
