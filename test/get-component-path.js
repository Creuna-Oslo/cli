const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const test = require('ava');
const tempy = require('tempy');

const getComponent = require('../source/utils/get-component-path');

const template = (
  t,
  { basePathRelative = '', pathOrName, expectedPathRelative }
) => {
  t.plan(1);

  const tempDir = tempy.directory();
  const basePath = path.join(tempDir, basePathRelative);
  const expectedPath = path.join(tempDir, expectedPathRelative);

  fsExtra.ensureDirSync(path.dirname(expectedPath));
  fs.writeFileSync(expectedPath, '');

  t.is(
    path.join(tempDir, expectedPathRelative),
    getComponent({
      basePath,
      pathOrName
    })
  );
  t.end();
};

test.cb('Basic', template, {
  pathOrName: 'component',
  expectedPathRelative: path.join('component', 'component.jsx')
});

test.cb('With file ext', template, {
  pathOrName: 'component.jsx',
  expectedPathRelative: path.join('component', 'component.jsx')
});

test.cb('With basePath', template, {
  pathOrName: 'component',
  basePathRelative: 'components',
  expectedPathRelative: path.join('components', 'component', 'component.jsx')
});

test.cb('Nested', template, {
  pathOrName: 'component/component',
  expectedPathRelative: path.join('component', 'component', 'component.jsx')
});

test.cb('Nested with file ext', template, {
  pathOrName: 'component/component.jsx',
  expectedPathRelative: path.join('component', 'component.jsx')
});

test.cb('Nested with basePath', template, {
  pathOrName: 'component/component',
  basePathRelative: 'components',
  expectedPathRelative: path.join(
    'components',
    'component',
    'component',
    'component.jsx'
  )
});

test.cb('Nested with basePath and file ext', template, {
  pathOrName: 'component/component.jsx',
  basePathRelative: 'components',
  expectedPathRelative: path.join('components', 'component', 'component.jsx')
});
