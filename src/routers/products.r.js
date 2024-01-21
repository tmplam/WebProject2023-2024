const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.c');

router.get('/', productsController.homeController);
router.get('/customer/detail/:bookId', productsController.bookDetailController);

module.exports = router;
