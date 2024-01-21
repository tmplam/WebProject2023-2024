const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.c');
const genresController = require('../controllers/genres.c');
const ordersController = require('../controllers/orders.c');
const usersController = require('../controllers/users.c');

router.get('/dashboard', productsController.dashBoardController);
router.get('/products', productsController.productsController);
router.get('/products/create', productsController.createProductController);
router.get('/products/:productId/edit', productsController.updateProductController);

router.get('/genres', genresController.genresController);

router.get('/orders', ordersController.ordersController);
router.get('/orders/:orderId/detail', ordersController.orderDetailController);

router.get('/customers', usersController.usersController);

module.exports = router;
