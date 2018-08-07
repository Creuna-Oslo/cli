const fs = require('fs');
const path = require('path');

const walkDirSync = (dirPath, accumulatedPath = '') =>
  fs.readdirSync(dirPath).reduce((accum, current) => {
    return accum.concat(
      fs.statSync(path.join(dirPath, current)).isFile()
        ? path.join(accumulatedPath, current)
        : walkDirSync(
            path.join(dirPath, current),
            path.join(accumulatedPath, current)
          )
    );
  }, []);

module.exports = walkDirSync;
