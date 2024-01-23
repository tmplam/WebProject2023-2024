const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.c');

router.get('/customer/orders/:userId', ordersController.getOrdersOfUserController);
router.get('/customer/orders/:orderId/detail', ordersController.getOrderDetailController);
router.post('/customer/orders/:orderId/detail', ordersController.adminUpdateOrderSummaryController);
router.post('/customer/orders/:orderId/cancel', ordersController.cancelOrderController);

module.exports = router;
