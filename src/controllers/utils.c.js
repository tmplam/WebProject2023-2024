require('dotenv').config();
const orderModel = require('../models/order.m');
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
                    req.session.successMessage = 'Payment success!';
                } else {
                    req.session.failMessage = 'Payment failed!';
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
