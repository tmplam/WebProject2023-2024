require('dotenv').config();
const orderModel = require('../models/order.m');
const cartModel = require('../models/cart.m');
const orderDetailModel = require('../models/orderDetail.m');
const bookModel = require('../models/book.m');
const userModel = require('../models/user.m');
const customError = require('../utils/custom-error');

module.exports = {
    orderSummaryController: async (req, res, next) => {
        const cartInfo = await cartModel.get(req.user.id);
        if (cartInfo.books.length == 0) {
            res.redirect('/customer/cart');
            return;
        }
        const nameError = req.session.nameError;
        const phoneError = req.session.phoneError;
        const addressError = req.session.addressError;

        delete req.session.nameError;
        delete req.session.phoneError;
        delete req.session.addressError;
        for (let book of cartInfo.books) {
            book.bookInfo = await bookModel.get(book.book_id);
        }
        const numCartItem = await cartModel.getNumItem(req.user.id);
        res.render('customer/summary', {
            loginUser: req.user,
            cartInfo,
            cart: true,
            nameError,
            phoneError,
            addressError,
            numCartItem,
            darkMode: req.session.darkMode,
        });
    },

    placeOrderController: async (req, res, next) => {
        let valid = true;
        const name = req.body.name.trim();
        const phone_number = req.body.phone_number.trim();
        const delivery_address = req.body.address.trim();

        if (name == '') {
            req.session.nameError = '(*) Name is required!';
            valid = false;
        }
        if (!/^(84|0[3|5|7|8|9])\d{8}$/.test(phone_number)) {
            req.session.phoneError = '(*) Invalid phone number!';
            valid = false;
        }
        if (delivery_address == '') {
            req.session.addressError = '(*) Address is required!';
            valid = false;
        }

        if (valid) {
            const cartInfo = await cartModel.get(req.user.id);
            for (let book of cartInfo.books) {
                book.bookInfo = await bookModel.get(book.book_id);
            }
            // Calculate total amount of order
            let total_amount = 0;
            for (let book of cartInfo.books) {
                total_amount += book.quantity * book.bookInfo.price;
            }
            // Create order
            const order = {
                order_by: req.user.id,
                order_date: new Date(),
                delivery_address,
                total_amount,
                delivery_status: 'Pending',
                phone_number,
            };
            const order_id = (await orderModel.add(order)).id;
            // Create order_details
            for (let book of cartInfo.books) {
                await orderDetailModel.add({
                    order_id,
                    book_id: book.book_id,
                    quantity: book.quantity,
                    price: book.quantity * book.bookInfo.price,
                });
            }
            // Delete all items in cart
            await cartModel.deleteCart(req.user.id);
            // Handle pay
            const authData = {
                name: req.user.name,
                'client-id': process.env.CLIENT_ID,
                'user-id': req.user.id,
                amount: total_amount,
                'order-id': order_id,
            };
            const response = await fetch(process.env.PAYMENT_AUTH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });
            const data = await response.json();
            if (data.status == 200) {
                res.redirect(
                    `${process.env.PAYMENT_LOGIN_URL}?authorization_code=${data.accessToken}&request=${data.requestID}`
                );
            } else {
                next(new customError('Page Not Found!', 404));
            }
        } else {
            res.redirect('back');
        }
    },

    getOrdersOfUserController: async (req, res, next) => {
        try {
            const orderList = await orderModel.getManyOrNone([
                { fieldName: 'order_by', value: req?.user?.id },
            ]);

            for (let i = 0; i < orderList.length; i++) {
                orderList[i].order_by = await userModel.get(orderList[i].order_by);
            }

            const numCartItem = await cartModel.getNumItem(req.user.id);
            res.render('customer/orders', {
                loginUser: req.user,
                orderList,
                order: true,
                numCartItem,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    getOrderDetailController: async (req, res, next) => {
        try {
            const orderDetail = await orderModel.get(req.params.orderId);
            orderDetail.order_by = await userModel.get(orderDetail.order_by);
            orderDetail.order_date = new Date(orderDetail.order_date).toLocaleString();
            orderDetail.delivery_date = orderDetail.delivery_date
                ? new Date(orderDetail.delivery_date).toLocaleDateString()
                : null;

            orderDetail.order_details = await orderDetailModel.getOrderDetails(orderDetail.id);

            for (let i = 0; i < orderDetail.order_details.length; i++) {
                orderDetail.order_details[i].book_title = (
                    await bookModel.get(orderDetail.order_details[i].book_id)
                ).title;
                orderDetail.order_details[i].book_price = (
                    orderDetail.order_details[i].price / orderDetail.order_details[i].quantity
                ).toFixed(2);
            }

            const successMessage = req.session.successMessage;
            const failMessage = req.session.failMessage;
            const phoneError = req.session.phoneError;
            const addressError = req.session.addressError;

            delete req.session.phoneError;
            delete req.session.addressError;
            delete req.session.successMessage;
            delete req.session.failMessage;

            res.render('customer/order-detail', {
                loginUser: req.user,
                orderDetail,
                order: true,
                phoneError,
                addressError,
                successMessage,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    cancelOrderController: async (req, res, next) => {
        try {
            const data = {
                delivery_status: req.body.delivery_status,
            };
            await orderModel.update(data, req.params.orderId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    // JUST FOR ADMIN
    ordersController: async (req, res, next) => {
        try {
            const orderList = await orderModel.getAll();
            for (let i = 0; i < orderList.length; i++) {
                orderList[i].order_by = await userModel.get(orderList[i].order_by);
            }

            res.render('admin/orders', {
                loginUser: req.user,
                orderList,
                orders: true,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    adminOrderSummaryController: async (req, res, next) => {
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

            const successMessage = req.session.successMessage;
            const phoneError = req.session.phoneError;
            const addressError = req.session.addressError;

            delete req.session.phoneError;
            delete req.session.addressError;
            delete req.session.successMessage;

            res.render('admin/order-detail', {
                loginUser: req.user,
                order,
                orders: true,
                phoneError,
                addressError,
                successMessage,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    adminUpdateOrderSummaryController: async (req, res, next) => {
        try {
            let valid = true;
            if (!/^(84|0[3|5|7|8|9])\d{8}$/.test(req.body.phone_number.trim())) {
                req.session.phoneError = '(*) Invalid phone number!';
                valid = false;
            }
            if (req.body.delivery_address.trim() == '') {
                req.session.addressError = '(*) Address is required!';
                valid = false;
            }

            if (valid) {
                const data = {
                    delivery_address: req.body.delivery_address,
                    phone_number: req.body.phone_number,
                };
                await orderModel.update(data, req.params.orderId);
                req.session.successMessage = 'Update order successfully!';
            }

            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    adminUpdateOrderStatusController: async (req, res, next) => {
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
