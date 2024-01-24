const tokenModel = require('../models/token-model')
const transactionModel = require('../models/transaction-model')
const accountModel = require('../models/account-model')
const requestModel = require('../models/request-model')

const objectUtils = require('../utils/objectUtils')

const getTransactionPage = async (req, res) => {
    const transactionID = req.params['id']
    const authorizationCode = req.query['authorization_code']

    try {
        if (!transactionID) {
            throw {
                status: 404,
                message: 'Page not found.'
            }
        }

        const transactionData = await transactionModel.getTransaction({ id: transactionID })
        if (objectUtils.isEmpty(transactionData)) {
            throw {
                status: 404,
                message: 'Page not found.'
            }
        }

        const userAccountData = await accountModel.getAccountModel({ id: transactionData.from_account })


        return res.render('transaction/payment', {
            from_account: transactionData.from_account,
            to_account: transactionData.to_account,
            amount: transactionData.amount,
            balance: userAccountData.balance,
            name: userAccountData.name,
            authorization_code: authorizationCode,
            created_time: transactionData.created_time,
            transactionID: transactionID
        })

    }
    catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message
        })
    }
}

const processTransaction = async (req, res) => {
    const transactionID = req.params['id']

    try {
        if (!transactionID) {
            throw {
                status: 401,
                message: 'Invalid transaction'
            }
        }

        const transactionData = await transactionModel.getTransaction({ id: transactionID })

        if (objectUtils.isEmpty(transactionData)) {
            throw {
                status: 401,
                message: 'Invalid transaction'
            }
        }

        const userAccountData = await accountModel.getAccountModel({ id: transactionData.from_account })

        if (transactionData.amount > userAccountData.balance) {
            await transactionModel.updateTransaction({ id: transactionID, status: 'Failed' })
            throw {
                status: 400,
                message: 'Insufficient funds. Cannot process the transaction.'
            };
        }

        await transactionModel.updateTransaction({ id: transactionID, status: 'Processing' })


        const requestID = transactionData.request_id
        const requestData = await requestModel.getRequest({ id: requestID })
        const clientID = requestData.client_id
        const clientAccountData = await accountModel.getAccountModelByMainSystemID({ id: clientID })

        await accountModel.updateAccountModel({ id: userAccountData.id, balance: userAccountData.balance - transactionData.amount })
        await accountModel.updateAccountModel({ id: clientAccountData.id, balance: clientAccountData.balance + transactionData.amount })


        await transactionModel.updateTransaction({ id: transactionID, status: 'Success' })

        return res.json({
            status: 200
        })

    }
    catch (err) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message
        })
    }
}

module.exports = {
    getTransactionPage,
    processTransaction
}