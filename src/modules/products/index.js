// const userRoutes = require('./userRoutes');
const ProductDAL = require('./product.dal');
const ProuctServices = require('./product.service');
const Product = require('./product.model');

const productDAL = new ProductDAL(Product);
const prouctServices = new ProuctServices(productDAL);

module.exports = {
  productDAL,
  prouctServices,
};
