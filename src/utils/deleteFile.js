const { unlinkSync } = require('fs');
const { isAbsolute, join } = require('path');
const ApiError = require('./errors/ApiError');

module.exports = function deleteFile(filePath) {
  const fullPath = join(__dirname, '../', '../', filePath);
  if (!isAbsolute(fullPath)) throw new ApiError('Invalid file path');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  unlinkSync(fullPath);
};
