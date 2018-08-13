const path = require('path');

module.exports = function({ basePath, pathOrName }) {
  // pathOrName is required
  if (!pathOrName) {
    throw new Error('No component name or path provided.');
  }

  const isFullPath = path.isAbsolute(pathOrName) && !!path.extname(pathOrName);

  // If pathOrName is not a full file path, basePath is required and must be an absolute path
  if (!isFullPath && (!basePath || !path.isAbsolute(basePath))) {
    throw new Error(`Bad 'basePath' (${basePath}). Path must be absolute`);
  }
};
