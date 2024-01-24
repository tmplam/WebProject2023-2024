const express = require('express')
const router = express.Router()

const { handleTransactionRequestFromClient } = require('../controllers/client-controllers')
const authControllers = require('../controllers/auth-controllers')

const { validateAuthorizationCode } = require('../middlewares/validate-token')

router

    .get('/login', validateAuthorizationCode, authControllers.getLoginPage)

    .post('/client', handleTransactionRequestFromClient)
    .post('/login', validateAuthorizationCode, authControllers.loginController)
    .post('/register', validateAuthorizationCode, authControllers.registerController)

module.exports = router