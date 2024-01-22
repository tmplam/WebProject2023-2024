const orderModel = require('../models/order.m');
const orderDetailModel = require('../models/orderDetail.m');
const bookModel = require('../models/book.m');
const userModel = require('../models/user.m');
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
            const orderList = await orderModel.getAll();
            for (let i = 0; i < orderList.length; i++) {
                orderList[i].order_by = await userModel.get(orderList[i].order_by);
            }

            res.render('admin/orders', { loginUser: req.user, orderList, orders: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    orderSummaryController: async (req, res, next) => {
        try {
            const order = await orderModel.get(req.params.orderId);
            order.order_by = await userModel.get(order.order_by);
            order.order_date = new Date(order.order_date).toLocaleString();
            order.delivery_date = order.delivery_date
                ? new Date(order.delivery_date).toLocaleDateString()
                : null;

            order.order_details = await orderDetailModel.getOrderDetails(order.id);

            for (let i = 0; i < order.order_details.length; i++) {
                order.order_details[i].book_title = (
                    await bookModel.get(order.order_details[i].book_id)
                ).title;
                order.order_details[i].book_price = (
                    order.order_details[i].price / order.order_details[i].quantity
                ).toFixed(2);
            }

            res.render('admin/order-detail', { loginUser: req.user, order, orders: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateOrderSummaryController: async (req, res, next) => {
        try {
            const data = {
                delivery_address: req.body.delivery_address,
                phone_number: req.body.phone_number,
            };
            await orderModel.update(data, req.params.orderId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateOrderStatusController: async (req, res, next) => {
        try {
            const data = {
                delivery_status: req.body.delivery_status,
            };
            if (data.delivery_status == 'Shipped') {
                data.delivery_date = new Date();
            }
            await orderModel.update(data, req.params.orderId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
