const express = require('express');
const router = express.Router();

const {
    getTransactionPage,
    processTransaction,
} = require('../controllers/transaction-controllers');

const { validateAuthorizationCode } = require('../middlewares/validate-token');

router

    .get('/:id/payment', validateAuthorizationCode, getTransactionPage)

    .post('/:id/payment', validateAuthorizationCode, processTransaction);

module.exports = router;
