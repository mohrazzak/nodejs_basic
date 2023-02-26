/* eslint-disable security/detect-object-injection */
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/errors');

const validate = (checks) => async (req, res, next) => {
  await Promise.all(checks.map((check) => check.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const sanitizedErrors = errors.array().reduce((acc, { msg, param }) => {
    // extra safety check for object injection
    const safeParam = param.replace(/[^a-zA-Z0-9_]/g, '');
    // No duplicated error messages
    if (!acc[safeParam]) {
      acc[safeParam] = { name: safeParam, error: msg };
    }
    return acc;
  }, {});

  return next(
    new ApiError('Validation failed.', StatusCodes.BAD_REQUEST, {
      errors: Object.values(sanitizedErrors),
    })
  );
};

module.exports = validate;
