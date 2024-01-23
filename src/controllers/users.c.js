const userModel = require('../models/user.m');
const cartModel = require('../models/cart.m');
const customError = require('../utils/custom-error');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    userProfileController: async (req, res, next) => {
        const numCartItem = await cartModel.getNumItem(req.user.id);
        res.render('customer/profile', {
            loginUser: req.user,
            numCartItem,
            darkMode: req.session.darkMode,
        });
    },

    // JUST FOR ADMIN
    usersController: async (req, res, next) => {
        try {
            const customerList = await userModel.getAllCustomers();
            res.render('admin/customers', {
                loginUser: req.user,
                customers: true,
                customerList,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    blockUnblockController: async (req, res, next) => {
        try {
            const user_id = req.params.customerId;
            const customer = await userModel.get(user_id);

            const operate = req.params.operate;

            if (operate === 'block') {
                customer.status = 'block';
            } else {
                customer.status = 'active';
            }
            await userModel.updateStatus(customer);
            res.json('success');
        } catch (error) {
            res.json('');
            // next(new customError(error.message, 503));
        }
    },

    getCreatePage: async (req, res, next) => {
        try {
            res.render('admin/create-customer', {
                loginUser: req.user,
                customers: true,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    createUserController: async (req, res, next) => {
        try {
            console.log(req.body);

            const username = req.body.username;
            const password = req.body.password;
            const fullname = req.body.fullname;
            const email = req.body.email;
            const role = Number(req.body.role);
            if (role !== 1 && role !== 2) {
                role = 1;
            }
            let user = await userModel.getByUsername(username);

            if (user && user.username) {
                throw new customError('Username existed', 400);
            }

            // Insert user into database
            user = new userModel({
                username: username,
                name: fullname,
                password: bcrypt.hashSync(password, saltRounds),
                email: email,
                address: null,
                role: role,
                account_number: null,
                phone_number: null,
            });

            delete user.id;
            delete user.avatar;
            delete user.created_date;
            await userModel.add(user);

            res.redirect('/admin/customers');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    viewProfileUser: async (req, res, next) => {
        try {
            const update = req.query.update;
            const user_id = req.params.customerId;
            const user = await userModel.get(user_id);
            res.render('admin/profile-customer', {
                loginUser: req.user,
                user: user,
                customers: true,
                update,
                darkMode: req.session.darkMode,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProfileUser: async (req, res, next) => {
        try {
            const user_id = req.params.customerId;
            let role = Number(req.body.role);
            let status = req.body.status;
            if (role !== 1 && role !== 2) role = 1;
            if (status !== 'block' && status !== 'active') status = 'active';

            const user = await userModel.get(user_id);
            if (user) {
                if (user.status !== status) {
                    user.status = status;
                    await userModel.updateStatus(user);
                }

                if (user.role !== role) {
                    user.role = role;
                    await userModel.updateRole(user);
                }
            }

            res.redirect(`/admin/customers/${user_id}/profile?update=true`);
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProfileController: async (req, res, next) => {
        try {
            await userModel.update(req.body, req.params.customerId);
            res.redirect('/customer/profile');
        } catch (error) {
            console.log(error);
            next(new customError(error.message, 503));
        }
    },
};
