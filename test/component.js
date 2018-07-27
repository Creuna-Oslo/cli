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
    `cd ${buildPath} && node ${getBinPath(buildPath)} component ${args}`,
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
  t.snapshot(fs.readFileSync(componentPath, 'utf-8'));
};

test.serial('Stateful component', template, ['component', 'y']);
test.serial('Stateful component (arguments)', template, [], 'component -s');
test.serial('Stateless component', template, ['component', '']);
