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
            const customerList = await userModel.getAllCustomers();
            res.render('admin/customers', { loginUser: req.user, customers: true, customerList });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    blockUnblockController: async (req, res, next) => {
        try {
            const user_id = req.params.customerId;
            const customer = await userModel.get(user_id);

            const operate = req.params.operate;
            
            if(operate === 'block') {
                customer.status = 'block';
            }
            else {
                customer.status = 'active';
            }
            await userModel.updateStatus(customer);
            res.json('success');
        } catch (error) {
            res.json('');
            // next(new customError(error.message, 503));
        }
    },
};
