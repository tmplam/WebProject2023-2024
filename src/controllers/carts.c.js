const cartModel = require('../models/cart.m');
const customError = require('../utils/custom-error');

module.exports = {
    cartController: async (req, res, next) => {
        res.render('customer/cart', { loginUser: req.user, cart: true });
    },
};
