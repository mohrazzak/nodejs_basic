class UserDAL {
  #UserModel;

  constructor(UserModel) {
    this.#UserModel = UserModel;
  }

  async findByEmail(email) {
    const user = await this.#UserModel.findOne({ where: { email } });
    return user;
  }

  getAllUsers() {
    return this.#UserModel.findAll({ attributes: { exclude: ['password'] } });
  }

  async create({ name, email, password }) {
    return this.#UserModel.create({
      name,
      email,
      password,
    });
  }

  getUserById(userId) {
    return this.#UserModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
  }

  async getUserByEmail(email) {
    return this.#UserModel.findOne({ where: { email } });
  }

  async changePassword({ id, password }) {
    return this.#UserModel.update({ password }, { where: { id } });
  }

  async activate(id) {
    return this.#UserModel.update({ isActive: true }, { where: { id } });
  }

  async delete(id) {
    return this.#UserModel.destroy({ where: { id } });
  }
}

module.exports = UserDAL;
