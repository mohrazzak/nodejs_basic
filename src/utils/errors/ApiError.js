class ApiError extends Error {
  constructor(
    message = 'An error occoured, please try again later.',
    statusCode = 500,
    data = {}
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

module.exports = ApiError;
