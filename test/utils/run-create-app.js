const fsExtra = require('fs-extra');
const path = require('path');
const tempy = require('tempy');

module.exports = () =>
  new Promise(res => {
    const buildPath = tempy.directory();

    fsExtra
      .copy(path.join(__dirname, '..', 'fixtures', 'app'), buildPath)
      .then(() =>
        fsExtra.copy(
          path.join(__dirname, '..', 'fixtures', 'components'),
          path.join(buildPath, 'source', 'components')
        )
      )
      .then(() => {
        res(buildPath);
      });
  });
