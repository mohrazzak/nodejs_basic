const nextHandler = require('./nextHandler');
const error404 = require('./error404');
const ApiError = require('./ApiError');

module.exports = { error404, nextHandler, ApiError };
