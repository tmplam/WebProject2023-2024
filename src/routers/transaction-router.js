const express = require('express');
const router = express.Router();

const {
    getTransactionPage,
    processTransaction,
    handleFailedTransaction,
    handleSuccessTransaction,
    handleTransactionCancel
} = require('../controllers/transaction-controllers');

const { validateAuthorizationCodeAndReturnJSON, validateAuthorizationCodeAndReturnPage } = require('../middlewares/validate-authorization_code');

router

    .get('/:id/payment', validateAuthorizationCodeAndReturnPage, getTransactionPage)
    .get('/:id/success', validateAuthorizationCodeAndReturnPage, handleSuccessTransaction)
    .get('/:id/failed', validateAuthorizationCodeAndReturnPage, handleFailedTransaction)

    .post('/:id/payment', validateAuthorizationCodeAndReturnJSON, processTransaction)

    .put('/:id/cancel', validateAuthorizationCodeAndReturnJSON, handleTransactionCancel)

module.exports = router;
