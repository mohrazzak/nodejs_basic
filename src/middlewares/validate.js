const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/errors');

const validate = (checks) => async (req, res, next) => {
  await Promise.all(checks.map((check) => check.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const result = errors.formatWith(({ msg, param }) => `[${param}]: ${msg}`);
  return next(
    new ApiError('Validation failed.', StatusCodes.BAD_REQUEST, {
      errors: result.array(),
    })
  );
};

module.exports = validate;
