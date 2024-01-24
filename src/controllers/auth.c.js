const User = require('../models/user.m');
const CustomError = require('../utils/custom-error');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    getLoginPage(req, res, next) {
        if (req.query.status === 'fail' || req.query.status === 'block') {
            return res.render('customer/login', {
                status: req.query.status,
                darkMode: req.session.darkMode,
            });
        }
        res.render('customer/login', { darkMode: req.session.darkMode });
    },

    getSignupPage(req, res, next) {
        res.render('customer/signup', { darkMode: req.session.darkMode });
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
        const darkMode = req.session.darkMode;
        req.logout((err) => {
            if (err) {
                throw new CustomError(err.message, 500);
            }
        });
        req.session.darkMode = darkMode;
        res.redirect('/');
    },
};
