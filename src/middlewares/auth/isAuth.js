const { StatusCodes } = require('http-status-codes');
const { TokenExpiredError } = require('jsonwebtoken');
const { ApiError } = require('../../utils/errors');
const { userServices } = require('../../modules/users');

async function generateTokens(user) {
  const newAuthToken = userServices.genToken(user, 'AUTH', 1000 * 60 * 1); // Generate new access token
  const newRefreshToken = userServices.genToken(
    user,
    'REFRESH',
    1000 * 60 * 60 * 24 * 30
  ); // Generate new refresh token

  await userServices.update(user.id, { refreshToken: newRefreshToken }); // Update refresh token in DB

  return { authToken: newAuthToken, refreshToken: newRefreshToken };
}

module.exports = async (req, res, next) => {
  const { authToken = '', refreshToken = '' } = req.cookies;
  if (!authToken && !refreshToken) {
    throw new ApiError('Access denied.', StatusCodes.UNAUTHORIZED);
  }

  try {
    const decodedAuth = await userServices.verifyToken({
      token: authToken,
      tokenType: 'AUTH',
    });

    const { isAdmin, isActive, id } = decodedAuth;

    req.user = {
      id,
      isAdmin,
      isActive,
    };

    return next();
  } catch (error) {
    if (!(error instanceof TokenExpiredError || (!authToken && refreshToken))) {
      return next(error);
    }

    try {
      console.log('Token Refreshed');
      const refreshDecoded = await userServices.verifyToken({
        token: refreshToken,
        tokenType: 'REFRESH',
      });
      const user = await userServices.getById(refreshDecoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError('Invalid refresh token.', StatusCodes.UNAUTHORIZED);
      }

      const { authToken: newAuthToken, refreshToken: newRefreshToken } =
        await generateTokens(user);

      res.cookie('authToken', newAuthToken, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 1), // 5 min
        httpOnly: true,
        sameSite: 'none',
        secure: false,
      });

      res.cookie('refreshToken', newRefreshToken, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 seconds
        httpOnly: true,
        sameSite: 'none',
        secure: false,
      });

      req.user = {
        id: user.id,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      };

      return next();
    } catch (e) {
      return next(e);
    }
  }
};
