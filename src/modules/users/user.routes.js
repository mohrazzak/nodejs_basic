const express = require('express');
const {
  getAllUsers,
  getUserById,
  register,
  login,
  resetPasswordReq,
  resetPasswordRes,
  confirm,
  deleteUser,
  getProfile,
} = require('./user.controller');
const { isAdmin, isAuth } = require('../../middlewares/auth');
const userValidator = require('./user.validation');
const { validate } = require('../../middlewares');

const router = express.Router();

router.get('/', isAuth, isAdmin, getAllUsers);

router.get('/profile', isAuth, getProfile);

router.get('/:userId', validate(userValidator.getUserById), getUserById);

router.post('/login', validate(userValidator.login), login);

router.post('/register', validate(userValidator.register), register);

router.post('/confirm/:token', validate(userValidator.confirm), confirm);

router.post(
  '/reset-password',
  validate(userValidator.resetReq),
  resetPasswordReq
);

router.put(
  '/reset-password/:token',
  validate(userValidator.resetRes),
  resetPasswordRes
);

router.delete(
  '/:userId',
  validate(userValidator.delete),
  isAuth,
  isAdmin,
  deleteUser
);


module.exports = router;
