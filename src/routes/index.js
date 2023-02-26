const { Router } = require('express');

const router = Router();

const userRoutes = require('../modules/users/user.routes');
const productRoutes = require('../modules/products/product.routes');

router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
