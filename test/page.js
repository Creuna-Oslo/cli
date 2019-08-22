const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');

const eslintConfig = require('./fixtures/app/.eslintrc.json');
const createMockApp = require('./utils/create-mock-app');
const mockMessages = require('./utils/mock-messages');
const mockPrompt = require('./utils/mock-prompt');

const pageFixture = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'components', 'static-site-page.jsx'),
  'utf8'
);

const createPage = async (answers, shellArguments = [], options) => {
  const runReactScript = proxyquire('../source/run-react-script', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = await createMockApp();
  const staticSitePath = path.join(buildPath, 'source', 'static-site', 'pages');

  await runReactScript({
    ...options,
    command: 'page',
    eslintConfig,
    staticSitePath,
    shellArguments
  });

  return staticSitePath;
};

test('With prompt', async t => {
  const staticSitePath = await createPage({
    pathOrName: 'new-page',
    groupName: 'Pages',
    humanReadableName: 'New page',
    pageUrl: '/some-url'
  });

  const pagePath = path.join(staticSitePath, 'new-page', 'new-page.jsx');

  const expectedContent = `/*
group: Pages
name: New page
path: /some-url
*/

${pageFixture}`;

  t.is(fs.existsSync(pagePath), true);
  t.is(expectedContent, fs.readFileSync(pagePath, 'utf-8'));
});

test('With arguments', async t => {
  const staticSitePath = await createPage({}, [
    'new-page',
    'New page',
    'Pages',
    '/some-url'
  ]);
  const pagePath = path.join(staticSitePath, 'new-page', 'new-page.jsx');

  const expectedContent = `/*
group: Pages
name: New page
path: /some-url
*/

${pageFixture}`;

  t.is(fs.existsSync(pagePath), true);
  t.is(expectedContent, fs.readFileSync(pagePath, 'utf-8'));
});

test('With custom data file extension', async t => {
  const staticSitePath = await createPage({}, ['new-page'], {
    dataFileExtension: 'js'
  });

  const dataFilePath = path.join(staticSitePath, 'new-page', 'new-page.js');

  t.is(true, fs.existsSync(dataFilePath));
});

test('With custom data file extension and content', async t => {
  const staticSitePath = await createPage({}, ['new-page'], {
    dataFileExtension: 'js',
    dataFileContent: 'export default { a: 1 };'
  });

  const dataFilePath = path.join(staticSitePath, 'new-page', 'new-page.js');

  t.is(true, fs.existsSync(dataFilePath));
  t.is('export default { a: 1 };', fs.readFileSync(dataFilePath, 'utf-8'));
});

test('With custom template', async t => {
  const staticSitePath = await createPage({}, ['new-page'], {
    staticPageTemplate: [
      'import React from "react";',
      'import content from %%dataFilePath%%;',
      'export const %%componentName%% = () => {};'
    ]
  });
  const expectedSource = `/*
 */

import React from 'react';
import content from './new-page.json';
export const NewPage = () => {};
`;
  const filePath = path.join(staticSitePath, 'new-page', 'new-page.jsx');

  t.is(expectedSource, fs.readFileSync(filePath, 'utf-8'));
});
