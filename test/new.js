const path = require('path');
const proxyquire = require('proxyquire');
const test = require('ava');
const tempy = require('tempy');

const mockPrompt = require('./utils/mock-prompt');
const mockMessages = require('./utils/mock-messages');
const walkDirSync = require('./utils/walk-dir-sync');

const template = async (t, answers, expectedFiles) => {
  const newApp = proxyquire('../source/new-app', {
    '@creuna/prompt': mockPrompt.bind(null, answers),
    './messages': mockMessages
  });

  const buildPath = tempy.directory();

  await newApp(buildPath);
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
    'jsconfig.json',
    'package.json',
    'scripts/create-app-components.js',
    'scripts/create-static-site-files.js',
    'scripts/frontmatter.js',
    'scripts/get-component-metadata.js',
    'scripts/handle-klaw-error.js',
    'scripts/prettier-config.js',
    'scripts/write-file.js',
    'source/components/README.md',
    'source/components/fluid-image/fluid-image.jsx',
    'source/components/fluid-image/fluid-image.scss',
    'source/components/fluid-image/index.js',
    'source/components/image/image.jsx',
    'source/components/image/image.scss',
    'source/components/image/index.js',
    'source/components/message/index.js',
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
    'source/static-site/pages/example-page/index.js',
    'source/static-site/pages/page-index/index.js',
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
    'jsconfig.json',
    'package.json',
    'scripts/create-app-components.js',
    'scripts/create-static-site-files.js',
    'scripts/frontmatter.js',
    'scripts/get-component-metadata.js',
    'scripts/handle-klaw-error.js',
    'scripts/prettier-config.js',
    'scripts/write-file.js',
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
    'source/static-site/pages/example-page/index.js',
    'source/static-site/pages/page-index/index.js',
    'source/static-site/pages/page-index/page-index.jsx',
    'source/static-site/routes.jsx',
    'tests/.eslintrc.json',
    'tests/example-page.js',
    'webpack.config.js'
  ]
);
