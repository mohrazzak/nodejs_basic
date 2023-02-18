const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('./product.controller');
const { isAdmin, isAuth } = require('../../middlewares/auth');
const productValidator = require('./product.validation');
const { validate } = require('../../middlewares');

const router = express.Router();

router.get('/', getAllProducts);

router.get(
  '/:productId',
  validate(productValidator.getProductById),
  getProductById
);

router.post(
  '/',
  validate(productValidator.createProduct),
  isAuth,
  isAdmin,
  createProduct
);

router.put(
  '/:productId',
  validate(productValidator.updateProduct),
  isAuth,
  isAdmin,
  updateProduct
);

router.delete(
  '/:productId',
  validate(productValidator.deleteProduct),
  isAuth,
  isAdmin,
  deleteProduct
);

module.exports = router;
