const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.c');

router.get('/customer/orders', ordersController.userOrderController);
router.get('/customer/summary', ordersController.orderSummaryController);

module.exports = router;
