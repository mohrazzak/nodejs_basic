// new
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
  },
} = require('../../config');

class UserServices {
  constructor(userDAL) {
    this.userDAL = userDAL;
  }

  async create(user) {
    return this.userDAL.create(user);
  }

  genToken({ id, isAdmin, email }, tokenType, minutes) {
    return jwt.sign(
      {
        id,
        isAdmin,
        email,
      },
      tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN,
      { expiresIn: `${minutes}m` }
    );
  }

  generalize(user) {
    return {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      email: user.email,
    };
  }

  async comparePasswords({ password, hashedPassword }) {
    if (!(await bcrypt.compare(password, hashedPassword))) return false;
    return true;
  }

  getAllUsers() {
    return this.userDAL.getAllUsers();
  }

  getUserByEmail(email) {
    return this.userDAL.getUserByEmail(email);
  }

  getUserById(id) {
    return this.userDAL.getUserById(id);
  }

  hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async sendMail(email, token, subject, path) {
    const mailURL = `${LOCAL_URL}:${NODE_PORT}/${path}/${token}`;
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
  }

  verifyToken(token, tokenType) {
    const SECRET = tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN;
    return jwt.verify(token, SECRET);
  }

  async changePassword({ id, password }) {
    const hashedPassword = await this.hashPassword(password);
    return this.userDAL.changePassword({ id, password: hashedPassword });
  }

  activate(id) {
    return this.userDAL.activate(id);
  }

  deleteUser(id) {
    return this.userDAL.delete(id);
  }
}

module.exports = UserServices;
