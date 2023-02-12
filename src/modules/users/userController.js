const { StatusCodes } = require('http-status-codes');
const { userServices } = require('.');
const { ApiError } = require('../../utils/errors');
const { responser } = require('../../utils');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getUserByEmail(email);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    if (!user.isActive)
      throw new ApiError('User is not active.', StatusCodes.BAD_REQUEST);

    const passMatch = await userServices.comparePasswords({
      password,
      hashedPassword: user.password,
    });
    if (!passMatch)
      throw new ApiError('Password is incorrect.', StatusCodes.BAD_REQUEST);

    const token = userServices.genToken(user, 'confirm', 60);
    const resUser = userServices.generalize(user);

    responser(res, StatusCodes.OK, {
      token,
      user: resUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const doesUserExist = await userServices.getUserByEmail(email);
    if (doesUserExist)
      throw new ApiError('Email already exists', StatusCodes.BAD_REQUEST);

    const hashedPassword = await userServices.hashPassword(password);

    const user = await userServices.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user)
      throw new ApiError('Could not register.', StatusCodes.BAD_REQUEST, {
        name,
        email,
      });
    const resUser = userServices.generalize(user);

    const emailToken = userServices.genToken(resUser, 'confirm', 60);
    await userServices.sendMail(
      email,
      emailToken,
      'Confirming Email',
      'confirm'
    );

    responser(res, StatusCodes.CREATED, resUser);
  } catch (error) {
    next(error);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodedToken = userServices.verifyToken(token, 'confirm');
    await userServices.activate(decodedToken.id);
    responser(res);
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordReq = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await userServices.getUserByEmail(email);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    const emailToken = userServices.genToken(user, 'reset', 1);
    await userServices.sendMail(
      email,
      emailToken,
      'Reset Password',
      'reset-password'
    );
    const resUser = userServices.generalize(user);
    responser(res, StatusCodes.OK, { user: resUser });
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordRes = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decodedToken = await userServices.verifyToken(token, 'reset');
    if (!decodedToken)
      throw new ApiError('Token is not valid.', StatusCodes.UNAUTHORIZED);
    await userServices.changePassword({
      id: decodedToken.id,
      password,
    });
    responser(res, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers();
    if (!users) throw new ApiError('Users not found.', StatusCodes.NOT_FOUND);

    responser(res, 200, { users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userServices.getUserById(userId);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    return responser(res, 200, { user });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userServices.getUserById(userId);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    await userServices.delete(userId);
    responser(res);
  } catch (error) {
    next(error);
  }
};
