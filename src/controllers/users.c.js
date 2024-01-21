const userModel = require('../models/user.m');
const customError = require('../utils/custom-error');

module.exports = {
    userProfileController: async (req, res, next) => {
        res.render('customer/profile', { loginUser: req.user });
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
