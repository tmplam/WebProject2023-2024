require('dotenv').config();
const orderModel = require('../models/order.m');
const bookModel = require('../models/book.m');
const orderDetailModel = require('../models/orderDetail.m');
const cartModel = require('../models/cart.m');
const customError = require('../utils/custom-error');

module.exports = {
    toggleDarkMode: async (req, res, next) => {
        try {
            req.session.darkMode = req.body.darkMode;
            res.json({ success: true });
        } catch (err) {
            throw new customError(err.message, 503);
        }
    },

    paymentCallBack: async (req, res, next) => {
        try {
            const code = req.query.code;
            const status = req.query.status;
            const orderId = req.params.orderId;

            if (code === process.env.PAYMENT_CODE) {
                if (status === 'success') {
                    await orderModel.update({ delivery_status: 'Payed' }, orderId);
                    // req.session.successMessage = 'Payment success!';

                    //update quatity of books here
                    const orderedBooks = await orderDetailModel.getManyOrNone([
                        { fieldName: 'order_id', value: orderId },
                    ]);

                    for (let oBook of orderedBooks) {
                        let book = await bookModel.get(oBook.book_id);
                        let quantity = book.stock_quantity - oBook.quantity;
                        quantity = quantity >= 0 ? quantity : 0;
                        await bookModel.update({ stock_quantity: quantity }, book.id);

                        // update quantity of cart
                        const cartItemsList = await cartModel.getAllCartItemsOfBook(book.id);
                        for (let cartItem of cartItemsList) {
                            if (cartItem.quantity > quantity) {
                                cartItem.quantity = quantity;
                                await cartModel.updateCartItem(cartItem);
                            }
                        }
                    }
                } else {
                    // req.session.failMessage = 'Payment failed!';
                }
                return res.redirect(`/customer/orders/${orderId}/detail`);
            } else {
                next(new customError('Page Not Found!', 400));
            }
        } catch (err) {
            throw new customError(err.message, 503);
        }
    },
};
