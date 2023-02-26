const { StatusCodes } = require('http-status-codes');
const { userServices } = require('.');
const { ApiError } = require('../../utils/errors');
const { responser } = require('../../utils');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getByEmail(email);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    if (!user.isActive)
      throw new ApiError('User is not active.', StatusCodes.BAD_REQUEST);

    await userServices.isPasswordMatch({
      password,
      hashedPassword: user.password,
    });

    const { authToken, refreshToken } = userServices.genToken(user, 'AUTH');

    await userServices.update(user.id, { refreshToken });

    const resUser = userServices.omitPassword(user);

    if (req.cookies.authToken) req.cookies.authToken = '';
    if (req.cookies.refreshToken) req.cookies.refreshToken = '';

    res.cookie('authToken', authToken, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7d
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7d
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });

    responser(res, StatusCodes.OK, {
      user: resUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const doesUserExist = await userServices.getByEmail(email);
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
    const resUser = userServices.omitPassword(user);

    const emailToken = userServices.genToken(resUser, 'EMAIL', 60);
    await userServices.sendMail(
      email,
      emailToken,
      'Confirming Email',
      'confirm'
    );

    responser(res, StatusCodes.CREATED, { user: resUser });
  } catch (error) {
    next(error);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodedToken = userServices.verifyToken({
      token,
      tokenType: 'EMAIL',
    });
    const activated = await userServices.activate(decodedToken.id);
    if (!activated)
      throw new ApiError(
        'Failed to activate user account. Please make sure your activation link is valid.',
        StatusCodes.BAD_REQUEST
      );
    responser(res);
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordReq = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.getByEmail(email);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    const emailToken = userServices.genToken(user, 'EMAIL', 30);

    await userServices.sendMail(
      email,
      emailToken,
      'Reset Password',
      'reset-password'
    );
    // Store the token in the user so i can verify it used once
    await userServices.update(user.id, { resetToken: emailToken });
    const resUser = userServices.omitPassword(user);
    responser(res, StatusCodes.OK, { user: resUser });
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordRes = async (req, res, next) => {
  try {
    // TODO dont allow multiple password changes
    const { token } = req.params;
    const { password } = req.body;
    const decodedToken = userServices.verifyToken({
      token,
      tokenType: 'EMAIL',
    });
    if (!decodedToken)
      throw new ApiError('Token is not valid.', StatusCodes.UNAUTHORIZED);
    const user = await userServices.getByEmail(decodedToken.email);
    const userDidntUsedItBefore = (await user.resetToken) !== token;
    if (userDidntUsedItBefore)
      throw new ApiError('Token is not valid.', StatusCodes.UNAUTHORIZED);
    await userServices.changePassword({
      id: decodedToken.id,
      password,
    });
    // re empty the reset so he can reset again but not use the same reset token
    await userServices.updateResetToken({ token: null, id: user.id });
    responser(res, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAll();
    if (!users) throw new ApiError('Users not found.', StatusCodes.NOT_FOUND);

    responser(res, 200, { users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userServices.getById(userId);
    if (!user) throw new ApiError('User not found.', StatusCodes.NOT_FOUND);
    return responser(res, 200, { user });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userServices.destroy(userId);
    responser(res);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userServices.getById(id);
    responser(res, StatusCodes.OK, { user });
  } catch (error) {
    next(error);
  }
};
