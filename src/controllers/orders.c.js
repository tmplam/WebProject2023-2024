const orderModel = require('../models/order.m');
const customError = require('../utils/custom-error');

module.exports = {
    orderSummaryController: async (req, res, next) => {
        res.render('customer/summary', { loginUser: req.user, cart: true });
    },

    userOrderController: async (req, res, next) => {
        // Add user order page
        res.render('customer/summary', { loginUser: req.user, order: true });
    },

    // JUST FOR ADMIN
    ordersController: async (req, res, next) => {
        try {
            res.render('admin/orders', { loginUser: req.user, orders: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    orderDetailController: async (req, res, next) => {
        try {
            res.render('admin/order-detail', { loginUser: req.user, orders: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
