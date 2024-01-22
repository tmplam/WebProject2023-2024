const express = require('express')
const router = express.Router()

const { handleTransactionRequestFromClient } = require('../controllers/client-controllers')
const authControllers = require('../controllers/auth-controllers')

router
    
    .get('/login', authControllers.getLoginPage)

    .post('/client', handleTransactionRequestFromClient)
    .post('/login', authControllers.loginController)

    .post('/login')
    .post('/register')

module.exports = router