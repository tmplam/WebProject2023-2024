const userModel = require('../models/user.m');
const cartModel = require('../models/cart.m');
const customError = require('../utils/custom-error');

module.exports = {
    userProfileController: async (req, res, next) => {
        const numCartItem = await cartModel.getNumItem(req.user.id);
        res.render('customer/profile', { loginUser: req.user, numCartItem });
    },

    // JUST FOR ADMIN
    usersController: async (req, res, next) => {
        try {
            res.render('admin/customers', { loginUser: req.user, customers: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
