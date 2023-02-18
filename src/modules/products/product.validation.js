const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

module.exports = {
  getUserById: [check('userId', 'Please enter a valid id.').isInt()],
  login: [
    check('email', 'Please enter a valid email.')
      .trim()
      .normalizeEmail()
      .isEmail(),
    check('password', 'Please enter a valid password.')
      .isLength({ min: 5, max: 16 })
      .isStrongPassword({ minSymbols: 0 }),
  ],
  register: [
    check('name', 'Please enter a valid name.')
      .trim()
      .isAlpha('en-US', { ignore: ' ' }),
    check('email', 'Please enter a valid email.')
      .trim()
      .normalizeEmail()
      .isEmail(),
    check('password', 'Please enter a valid password.')
      .isLength({ min: 5, max: 16 })
      .isStrongPassword({ minSymbols: 0 }),
  ],
  confirm: [
    check('token', 'Please enter a valid token').matches(
      '(^[A-Za-z0-9-_]*.[A-Za-z0-9-_]*.[A-Za-z0-9-_]*$)'
    ),
  ],
  resetReq: [
    check('email', 'Please enter a valid email')
      .trim()
      .normalizeEmail()
      .isEmail(),
  ],
  resetRes: [
    check('token', 'Please enter a valid token').matches(
      '(^[A-Za-z0-9-_]*.[A-Za-z0-9-_]*.[A-Za-z0-9-_]*$)'
    ),
    check('password', 'Please enter a valid password')
      .isLength({ min: 5, max: 16 })
      .isStrongPassword({ minSymbols: 0 }),
  ],
  delete: [check('userId', 'Please enter a valid id.').isInt()],
};
