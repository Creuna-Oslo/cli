const test = require('ava');
const path = require('path');

const validatePaths = require('../source/utils/validate-paths');

const template = (t, basePath, pathOrName) => {
  t.notThrows(() => {
    validatePaths({ basePath, pathOrName });
  });
};

const throwsTemplate = (t, basePath, pathOrName) => {
  t.throws(() => {
    validatePaths({ basePath, pathOrName });
  });
};

test('Full path', template, undefined, path.join(__dirname, 'something.js'));
test('Relative path', template, __dirname, 'something');

test('Missing pathOrName', throwsTemplate, undefined, undefined);
test('Relative path without basePath', throwsTemplate, undefined, 'something');
test(
  'Relative path with non-absolute basePath',
  throwsTemplate,
  'Users/user/Documents',
  'something'
);
