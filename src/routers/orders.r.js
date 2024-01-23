const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.c');


router.get('/customer/orders/:userId', ordersController.getOrdersOfUserController);
router.get('/customer/orders/:orderId/detail', ordersController.getOrderDetailController);
router.post('/customer/orders/:orderId/detail', ordersController.adminUpdateOrderSummaryController);
router.post('/customer/orders/:orderId/cancel', ordersController.cancelOrderController);

router.get('/customer/orders', ordersController.userOrderController);
router.get('/customer/summary', ordersController.orderSummaryController);
router.post('/customer/summary', ordersController.placeOrderController);

module.exports = router;
