const requestModel = require('../models/request-model')
const accountModel = require('../models/account-model')
const clientModel = require('../models/client-model')
const transactionModel = require('../models/transaction-model')

const objectUtils = require('../utils/objectUtils')
const authUtils = require('../utils/authUtils')


const getLoginPage = async (req, res) => {
    const request = req.query['request']
    // const token = req.authorization['token']

    try {
        const requestData = await requestModel.getRequest({ id: request })
        if (objectUtils.isEmpty(requestData)) {
            throw {
                status: 404,
                message: 'Page not found.'
            }
        }

        return res.render('auth/login', { request, name: requestData.name, token: '123' })
    }
    catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message
        })
    }
}

const loginController = async (req, res) => {
    const password = req.body['password']
    const request = req.query['request']

    try {
        const requestData = await requestModel.getRequest({ id: request })
        if (objectUtils.isEmpty(requestData)) {
            throw {
                status: 404,
                message: 'Page not found.'
            }
        }

        const userID = requestData.userID
        const accountData = await accountModel.getAccountModelByMainSystemID({ id: userID })

        if (!authUtils.checkPassword(password, accountData.password)) {
            return res.status(401).render('auth/login', {
                status: 401,
                message: 'Wrong password'
            })
        }
        // const clienData = await cli
        const clientAccountData = await accountModel.getAccountModelByMainSystemID({id: re})


        const transactionID = transactionModel.addTransaction({})


    }
    catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message
        })
    }
}

module.exports = {
    getLoginPage,
    loginController
}