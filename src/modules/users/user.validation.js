const { check } = require('express-validator');
const { ApiError } = require('../../utils/errors');

module.exports = {
  getUserById: [check('userId', 'Please enter a valid user ID.').isInt()],

  login: [
    check('email', 'Please enter a valid email address.')
      .trim()
      .normalizeEmail()
      .isEmail(),
    check(
      'password',
      'Password must be between 5 and 16 characters and meet password requirements.'
    )
      .isLength({ min: 5, max: 16 })
      .isStrongPassword({ minSymbols: 0 }),
  ],

  register: [
    check(
      'name',
      'Please enter a valid name with first and last name separated by a space.'
    )
      .trim()
      .matches(/^([a-zA-Z]+)\s+([a-zA-Z]+)$/, 'i'),
    check('email', 'Please enter a valid email address.')
      .trim()
      .normalizeEmail()
      .isEmail(),
    check(
      'password',
      'Password must be between 5 and 16 characters and meet password requirements.'
    )
      .isLength({ min: 5, max: 16 })
      .isStrongPassword({ minSymbols: 0 }),
  ],

  confirm: [
    check('token', 'Please enter a valid confirmation token.').matches(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    ),
  ],

  resetReq: [
    check('email', 'Please enter a valid email address.')
      .trim()
      .normalizeEmail()
      .isEmail(),
  ],

  resetRes: [
    check('token', 'Please enter a valid reset token.').matches(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    ),
    check(
      'password',
      'Password must be between 5 and 16 characters and meet password requirements.'
    )
      .isLength(
        {
          min: 5,
          max: 16,
        },
        'Password must be between 5 and 16 characters.'
      )
      .isStrongPassword({ minSymbols: 0 }, 'Password must be strong enough.'),
  ],

  delete: [check('userId', 'Please enter a valid user ID.').isInt()],
};
