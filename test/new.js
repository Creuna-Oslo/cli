const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');
const tempy = require('tempy');

const mockPrompt = require('./utils/mock-prompt');
const mockMessages = require('./utils/mock-messages');
const walkDirSync = require('./utils/walk-dir-sync');

const runNewApp = async answers => {
  const newApp = proxyquire('../source/new-app', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = tempy.directory();

  await newApp(buildPath);

  return buildPath;
};

const template = async (t, answers, expectedFiles) => {
  const buildPath = await runNewApp(answers);
  const allFiles = walkDirSync(buildPath);

  t.deepEqual(
    expectedFiles.join('\n'),
    allFiles
      .map(filePath => filePath.replace(new RegExp(`${path.sep}/g`), '/'))
      .join('\n')
  );
};

test(
  'All options enabled',
  template,
  {
    projectName: 'project',
    authorName: 'author',
    authorEmail: 'email',
    useApiHelper: true,
    useMessenger: true,
    useAnalyticsHelper: true,
    useResponsiveImages: true,
    shouldWriteVSCodeTasks: true
  },
  [
    '.babelrc',
    '.creunarc.json',
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.json',
    '.gitignore',
    '.prettierignore',
    '.vscode/tasks.json',
    'README.md',
    'browserslist',
    'codegen/components.js',
    'codegen/pages.js',
    'jsconfig.json',
    'package.json',
    'source/components/README.md',
    'source/components/fluid-image/fluid-image.jsx',
    'source/components/fluid-image/fluid-image.scss',
    'source/components/image/image.jsx',
    'source/components/image/image.scss',
    'source/components/message/message.jsx',
    'source/components/message/message.scss',
    'source/js/analytics.js',
    'source/js/api-helper.js',
    'source/js/input-detection-loader.js',
    'source/js/input-detection.js',
    'source/js/messenger.js',
    'source/js/polyfills/class-list.js',
    'source/js/responsive-images.js',
    'source/js/server-polyfills.js',
    'source/scss/fonts.scss',
    'source/scss/mixins.scss',
    'source/scss/site.scss',
    'source/scss/style.scss',
    'source/scss/vars.scss',
    'source/static-client.js',
    'source/static-server.js',
    'source/static-site/api/example-api-response.json',
    'source/static-site/app.jsx',
    'source/static-site/assets/uni.gif',
    'source/static-site/layout.jsx',
    'source/static-site/pages/example-page/example-page.json',
    'source/static-site/pages/example-page/example-page.jsx',
    'source/static-site/pages/page-index/page-index.jsx',
    'source/static-site/routes.jsx',
    'tests/.eslintrc.json',
    'tests/example-page.js',
    'webpack.config.js'
  ]
);

test(
  'All options disabled',
  template,
  {
    projectName: 'project',
    authorName: 'author',
    authorEmail: 'email',
    useApiHelper: false,
    useMessenger: false,
    useAnalyticsHelper: false,
    useResponsiveImages: false,
    shouldWriteVSCodeTasks: false
  },
  [
    '.babelrc',
    '.creunarc.json',
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.json',
    '.gitignore',
    '.prettierignore',
    'README.md',
    'browserslist',
    'codegen/components.js',
    'codegen/pages.js',
    'jsconfig.json',
    'package.json',
    'source/components/README.md',
    'source/js/input-detection-loader.js',
    'source/js/input-detection.js',
    'source/js/polyfills/class-list.js',
    'source/js/server-polyfills.js',
    'source/scss/fonts.scss',
    'source/scss/mixins.scss',
    'source/scss/site.scss',
    'source/scss/style.scss',
    'source/scss/vars.scss',
    'source/static-client.js',
    'source/static-server.js',
    'source/static-site/api/example-api-response.json',
    'source/static-site/app.jsx',
    'source/static-site/assets/uni.gif',
    'source/static-site/layout.jsx',
    'source/static-site/pages/example-page/example-page.json',
    'source/static-site/pages/example-page/example-page.jsx',
    'source/static-site/pages/page-index/page-index.jsx',
    'source/static-site/routes.jsx',
    'tests/.eslintrc.json',
    'tests/example-page.js',
    'webpack.config.js'
  ]
);

test('Writes correct .eslintrc.json', async t => {
  const buildPath = await runNewApp({
    projectName: 'project',
    authorName: 'author',
    authorEmail: 'email'
  });

  const eslintRcContent = fs.readFileSync(
    path.join(buildPath, '.creunarc.json'),
    'utf8'
  );

  t.deepEqual(
    {
      componentsPath: 'source/components',
      staticSitePath: 'source/static-site/pages',
      dataFileContent: '{}',
      dataFileExtension: 'json'
    },
    JSON.parse(eslintRcContent)
  );
});
