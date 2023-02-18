const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../utils/errors');
const { prouctServices } = require('.');
const { responser } = require('../../utils');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prouctServices.getAllProducts();
    if (!products)
      throw new ApiError('Products not found.', StatusCodes.NOT_FOUND);

    responser(res, 200, { products });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await prouctServices.getProductById(productId);
    if (!product)
      throw new ApiError('Product not found.', StatusCodes.NOT_FOUND);
    return responser(res, 200, { product });
  } catch (error) {
    return next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await prouctServices.createProduct(req.body);
    responser(res, StatusCodes.CREATED, { product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await prouctServices.updateProduct(
      productId,
      req.body
    );
    if (!updatedProduct)
      throw new ApiError('Product not found.', StatusCodes.NOT_FOUND);
    return responser(res, 200, { updatedProduct });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await prouctServices.getProductById(productId);
    if (!product)
      throw new ApiError('Product not found.', StatusCodes.NOT_FOUND);
    await prouctServices.deleteProduct(productId);
    responser(res);
  } catch (error) {
    next(error);
  }
};
