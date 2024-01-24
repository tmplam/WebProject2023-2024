const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.c');
const passport = require('passport');
const customError = require('../utils/custom-error');

router.get('/login', authController.getLoginPage);
router.post(
    '/login',
    passport.authenticate('MyStrategy', {
        failureRedirect: '/auth/login?status=fail',
    }),
    (req, res, next) => {
        req.session.darkMode = req.session.passport.user.darkMode;
        req.session.passport.user = req.session.passport.user.username;

        if (req.user.role === 2) {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    }
);

// login with google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login?status=block' }),
    (req, res) => {
        res.redirect('/');
    }
);

// signup
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.signUpController);
router.post('/signup/validate', authController.signUpValidate);

// logout
router.get('/logout', authController.getLogout);

module.exports = router;
