class ProductService {
  constructor(productDAL) {
    this.productDAL = productDAL;
  }

  async create(product) {
    return this.productDAL.create(product);
  }

  async getAll() {
    return this.productDAL.findAll();
  }

  async getById(productId) {
    return this.productDAL.findById(productId);
  }

  async update(productId, productData) {
    const product = await this.getById(productId);
    return product.update(productData);
  }

  async delete(productId) {
    const product = await this.getById(productId);
    return product.destroy();
  }
}

module.exports = ProductService;
