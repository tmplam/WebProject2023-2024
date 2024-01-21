const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.c');

router.get('/customer/cart', cartsController.cartController);

module.exports = router;
