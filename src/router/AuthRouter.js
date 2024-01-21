const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const passport = require('passport');
const customError = require('../utils/custom-error')


router.get('/login', authController.getLoginPage);
router.post('/login', passport.authenticate('MyStrategy',{
    failureRedirect: '/login?status=fail'
}), (req, res, next) => {
    res.redirect('/');
})

//login with google
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login'}), 
    (req, res) => {
        res.redirect('/');
    });


//signup
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.signUpController);
router.post('/signup/validate', authController.signUpValidate);


router.use('/', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new customError('Unauthrization', 401));
    }
    next();
})

module.exports = router;