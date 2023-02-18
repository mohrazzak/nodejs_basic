class ProductDAL {
  #ProductModel;

  constructor(ProductModel) {
    this.#ProductModel = ProductModel;
  }

  async create(product) {
    const createdProduct = await this.#ProductModel.create(product);
    return createdProduct.toJSON();
  }

  async getById(id) {
    const product = await this.#ProductModel.findOne({ where: { id } });
    return product ? product.toJSON() : null;
  }

  async getAll() {
    const products = await this.#ProductModel.findAll();
    return products.map((p) => p.toJSON());
  }

  async update(id, updates) {
    const [rowsUpdated, [updatedProduct]] = await this.#ProductModel.update(
      updates,
      {
        where: { id },
        returning: true,
      }
    );
    if (rowsUpdated !== 1) {
      return null;
    }
    return updatedProduct.toJSON();
  }

  async delete(id) {
    const rowsDeleted = await this.#ProductModel.destroy({ where: { id } });
    return rowsDeleted === 1;
  }
}

module.exports = ProductDAL;
