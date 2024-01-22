const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.c');

router.get('/customer/cart', cartsController.cartController);
router.post('/customer/detail/:bookId', cartsController.addToCartController);
router.get('/customer/cart/delete', cartsController.deleteCartController);
router.get('/customer/cart/:operate', cartsController.updateCartController);


module.exports = router;
