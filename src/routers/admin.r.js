const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.c');
const genresController = require('../controllers/genres.c');
const ordersController = require('../controllers/orders.c');
const usersController = require('../controllers/users.c');

router.get('/dashboard', productsController.dashBoardController);

// Products management
router.get('/products', productsController.productsController);
router.get('/products/create', productsController.createProductController);
router.get('/products/:productId/edit', productsController.updateProductController);

// Genres management
router.get('/genres', genresController.genresController);
router.post('/genres', genresController.createGenreController);
router.post('/genres/:genreId/update', genresController.updateGenreController);
router.post('/genres/:genreId/delete', genresController.deleteGenreController);

router.get('/orders', ordersController.ordersController);
router.get('/orders/:orderId/detail', ordersController.orderSummaryController);
router.post('/orders/:orderId/detail', ordersController.updateOrderSummaryController);
router.post('/orders/:orderId/change-status', ordersController.updateOrderStatusController);

router.get('/customers', usersController.usersController);

module.exports = router;
