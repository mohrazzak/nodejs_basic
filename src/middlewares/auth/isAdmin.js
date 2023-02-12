const { StatusCodes } = require('http-status-codes');

const { ApiError } = require('../../utils/errors');

module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return next(new ApiError('Not Authorized', StatusCodes.UNAUTHORIZED));
};
