const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../utils/errors');

const {
  constants: {
    EM_HOST,
    EM_USER,
    EM_PASSWORD,
    NODE_ENV,
    EMAIL_TOKEN,
    LOCAL_URL,
    NODE_PORT,
    AUTH_TOKEN,
    REFRESH_TOKEN,
  },
} = require('../../config');

class UserServices {
  constructor(userDAL) {
    this.userDAL = userDAL;
  }

  async create(user) {
    return this.userDAL.create(user);
  }

  // genToken({ id, isAdmin, email }, tokenType, minutes) {
  //   return jwt.sign(
  //     {
  //       id,
  //       isAdmin,
  //       email,
  //     },
  //     tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN,
  //     { expiresIn: `${minutes}m` }
  //   );
  // }

  omitPassword(user) {
    const { password, ...rest } = user;
    return rest;
  }

  async isPasswordMatch({ password, hashedPassword }) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        throw new ApiError('Password incorrect', StatusCodes.UNAUTHORIZED);
      }
      return isMatch;
    } catch (err) {
      throw new ApiError(
        'Password incorrect',
        StatusCodes.INTERNAL_SERVER_ApiError
      );
    }
  }

  getAll() {
    return this.userDAL.getAll();
  }

  getByEmail(email) {
    return this.userDAL.getByEmail(email);
  }

  getById(id) {
    return this.userDAL.getById(id);
  }

  async hashPassword(password) {
    try {
      const hashedPasswrd = await bcrypt.hash(password, 10);
      return hashedPasswrd;
    } catch (err) {
      throw new ApiError(
        'ApiError hashing password',
        StatusCodes.INTERNAL_SERVER_ApiError
      );
    }
  }

  async sendMail(email, token, subject, path) {
    try {
      const mailURL = `${LOCAL_URL}:${NODE_PORT}/users/${path}/${token}`;
      if (NODE_ENV === 'development') console.log(mailURL);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: EM_HOST,
        auth: {
          user: EM_USER,
          pass: EM_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: `"e-commerce" <${process.env.EM_USER}>`,
        to: email,
        subject,
        html: `
        <h1>E-COMMERCE EMAIL [${subject}]</h1>
        <p>Click
        // TODO use Frontend url instead
        <a href="" target="_blank">this link</a>
        to proceed your request for ${subject}</p>
        <p>Greetings.</p>
        `,
      });
    } catch (err) {
      throw new ApiError(`Failed to send email`);
    }
  }

  // verifyToken(token, tokenType) {
  //   try {
  //     const SECRET = tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN;
  //     const decodedToken = jwt.verify(token, SECRET);
  //     return decodedToken;
  //   } catch (err) {
  //     throw new ApiError(
  //       `Failed to verify token: ${err.message}`,
  //       StatusCodes.UNAUTHORIZED
  //     );
  //   }
  // }

  update(userId, updatedInfo) {
    return this.userDAL.update(userId, updatedInfo);
  }

  async changePassword({ id, password }) {
    try {
      const hashedPassword = await this.hashPassword(password);
      return this.userDAL.changePassword({ id, password: hashedPassword });
    } catch (err) {
      throw new ApiError(`Failed to change user password`);
    }
  }

  async isUserExists(email) {
    return this.userDAL.isUserExists(email);
  }

  async activate(userId) {
    const user = await this.getById(userId);
    const { isActive } = user;
    if (isActive) {
      throw new ApiError(`User is already activated`);
    }
    const isActivated = await this.userDAL.activate(userId);
    if (!isActivated) {
      throw new ApiError(`Failed to activate user with id ${userId}`);
    }

    return true;
  }

  destroy(userId) {
    return this.userDAL.destroy(userId);
  }

  // Verifies a token and returns the decoded token if valid
  verifyToken({ token, tokenType }) {
    const secret = this.getSecret(tokenType);
    return jwt.verify(token, secret);
  }

  genToken({ isAdmin, id, isActive }, tokenType, expiresInMs) {
    try {
      const secret = this.getSecret(tokenType);
      return jwt.sign({ isAdmin, id, isActive }, secret, {
        expiresIn: `${expiresInMs}ms`,
      });
    } catch (err) {
      throw new ApiError(`Failed to verify token.`, StatusCodes.UNAUTHORIZED);
    }
  }

  // Returns the secret for the given token type
  getSecret(tokenType) {
    switch (tokenType) {
      case 'AUTH':
        return AUTH_TOKEN;
      case 'EMAIL':
        return EMAIL_TOKEN;
      case 'REFRESH':
        return REFRESH_TOKEN;
      default:
        throw new ApiError(`Unknown token type: ${tokenType}`);
    }
  }
}

module.exports = UserServices;
