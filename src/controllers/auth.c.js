const User = require('../models/user.m');
const CustomError = require('../utils/custom-error');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    getLoginPage(req, res, next) {
        if (req.query.status === 'fail' || req.query.status === 'block') {
            return res.render('customer/login', {
                status: req.query.status,
            });
        }
        res.render('customer/login');
    },

    getSignupPage(req, res, next) {
        res.render('customer/signup');
    },

    async signUpController(req, res, next) {
        console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;
        const fullname = req.body.fullname;
        const email = req.body.email;
        let user = await User.getByUsername(username);

        if (user && user.username) {
            throw new CustomError('Username existed', 400);
        }

        // Insert user into database
        user = new User({
            username: username,
            name: fullname,
            password: bcrypt.hashSync(password, saltRounds),
            email: email,
            address: null,
            role: 1,
            account_number: null,
            phone_number: null,
        });

        delete user.id;
        delete user.avatar;
        delete user.created_date;
        await User.add(user);
        res.redirect('/auth/login');
    },

    async signUpValidate(req, res, next) {
        console.log('Validate: ', req.body);
        const user = await User.getByUsername(req.body.username);
        if (user && user.username) {
            res.json('Existed username');
        } else {
            res.json('');
        }
    },

    getLogout(req, res, next) {
        req.logout((err) => {
            if (err) {
                throw new CustomError(err.message, 500);
            }
        });
        res.redirect('/');
    },
};
