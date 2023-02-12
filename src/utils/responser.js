module.exports = (
  res = {},
  statusCode = 200,
  data = {},
  message = 'Operation done succesfully.'
) => {
  res.status(statusCode).json({ message, data });
};
