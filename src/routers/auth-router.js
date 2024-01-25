const express = require('express');
const router = express.Router();

const { handleTransactionRequestFromClient } = require('../controllers/client-controllers');
const authControllers = require('../controllers/auth-controllers');

const { validateAuthorizationCodeAndReturnJSON, validateAuthorizationCodeAndReturnPage } = require('../middlewares/validate-authorization_code');

router

    .get('/login', validateAuthorizationCodeAndReturnPage, authControllers.getLoginPage)

    .post('/client', handleTransactionRequestFromClient)
    .post('/login', validateAuthorizationCodeAndReturnJSON, authControllers.loginController)
    .post('/register', validateAuthorizationCodeAndReturnJSON, authControllers.registerController);
    
module.exports = router;
