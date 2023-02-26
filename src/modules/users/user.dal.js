const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../utils/errors');

class UserDAL {
  #UserModel;

  constructor(userModel) {
    this.#UserModel = userModel;
  }

  async getByEmail(email) {
    const user = await this.#UserModel.findOne({ where: { email } });
    return user?.toJSON();
  }

  async isUserExists(email) {
    const user = await this.#UserModel.findOne({ where: { email } });
    return !!user;
  }

  async getAll() {
    const users = await this.#UserModel.findAll({
      attributes: { exclude: ['password'] },
    });
    return users.map((user) => user?.toJSON());
  }

  async create(user) {
    try {
      const createdUser = await this.#UserModel.create(user);
      return createdUser?.toJSON();
    } catch (err) {
      throw new ApiError(err, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(userId) {
    const user = await this.#UserModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return user?.toJSON();
  }

  async changePassword({ id, password }) {
    const [numUpdatedRows] = await this.#UserModel.update(
      { password },
      { where: { id }, returning: true }
    );
    if (numUpdatedRows === 0) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return true;
  }

  async activate(userId) {
    const [numUpdatedRows] = await this.#UserModel.update(
      { isActive: true },
      { where: { id: userId } }
    );
    if (numUpdatedRows === 0) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return true;
  }

  async update(id, updatedInfo) {
    const [numUpdatedRows] = await this.#UserModel.update(updatedInfo, {
      where: { id },
    });
    if (numUpdatedRows === 0) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return true;
  }

  async destroy(userId) {
    const numDeletedRows = await this.#UserModel.destroy({
      where: { id: userId },
    });
    if (numDeletedRows === 0) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return true;
  }
}
module.exports = UserDAL;
