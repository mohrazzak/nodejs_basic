const deleteFile = require('../deleteFile');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  // check if the request object contains an uploaded image file
  if (req.file) deleteFile(req.file.path);
  console.log(error);
  const { message = 'An error occoured.', statusCode = 500, data = {} } = error;
  res.status(statusCode).json({ message, data });
};
