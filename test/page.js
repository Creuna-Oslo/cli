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
    `cd ${buildPath} && node ${getBinPath(buildPath)} page ${args}`,
    answers
  );

  const pagePath = path.join(
    buildPath,
    'source',
    'mockup',
    'pages',
    'new-page',
    'new-page.jsx'
  );
  t.is(fs.existsSync(pagePath), true);
  t.snapshot(fs.readFileSync(pagePath, 'utf-8'));
};

test.serial('With prompt', template, ['new-page', 'New/page']);
test.serial('With arguments', template, [], 'new-page New/page');
