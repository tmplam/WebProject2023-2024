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
    updateProfileController: async(req, res, next) => {
        console.log(req.body);
        try {
            await userModel.update(req.body, req.params.customerId);
            res.redirect('/customer/profile');
        } catch (error) {
            console.log(error);
            next(new customError(error.message, 503));
        }
    }
};
