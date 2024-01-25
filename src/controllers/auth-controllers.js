const requestModel = require('../models/request-model');
const accountModel = require('../models/account-model');
const transactionModel = require('../models/transaction-model');
const tokenModel = require('../models/token-model');

const objectUtils = require('../utils/objectUtils');
const authUtils = require('../utils/authUtils');
const tokenUtils = require('../utils/tokenUtils');
const accountUtils = require('../utils/accountUtils');

const getLoginPage = async (req, res) => {
    const request = req.query['request'];
    const authorizationCode = req.query['authorization_code']

    try {
        const requestData = await requestModel.getRequest({ id: request });
        if (objectUtils.isEmpty(requestData)) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        const userID = requestData.user_id;
        const userAccountData = await accountModel.getAccountModelByMainSystemID({ id: userID });

        if (objectUtils.isEmpty(userAccountData)) {
            return res.render('auth/register', { request, name: requestData.name, authorizationCode });
        }

        return res.render('auth/login', { request, name: requestData.name, authorizationCode });
    } catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message,
        });
    }
};

const loginController = async (req, res) => {
    const password = req.body['password'];
    const request = req.query['request'];
    const code = req.query['authorization_code'];

    try {
        const requestData = await requestModel.getRequest({ id: request });

        const userID = requestData.user_id;
        const userAccountData = await accountModel.getAccountModelByMainSystemID({ id: userID });

        if (!(await authUtils.checkPassword(password, userAccountData.password))) {
            throw {
                status: 401,
                message: 'Invalid password',
            };
        }

        const clientID = requestData.client_id;
        const clientAccountData = await accountModel.getAccountModelByMainSystemID({
            id: clientID,
        });

        const transactionID = await transactionModel.addTransaction({
            fromAccount: userAccountData.id,
            toAccount: clientAccountData.id,
            amount: requestData.amount,
            requestID: request,
        });

        const userToken = tokenUtils.generateNewToken({ userID });
        await tokenModel.addToken({ token: userToken });
        await tokenModel.deleteToken({ token: code });

        return res.json({
            authorization_code: userToken,
            transaction_id: transactionID.id,
        });
    } catch (err) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }
};

const registerController = async (req, res) => {
    const password = req.body['password'];
    const confirmedPassword = req.body['confirmedPassword'];
    const request = req.query['request'];

    const code = req.query['authorization_code'];
    try {
        const requestData = await requestModel.getRequest({ id: request });

        const userID = requestData.user_id;

        if (password !== confirmedPassword) {
            throw {
                status: 401,
                message: 'Passwords do not match',
            };
        }

        const hashedPassword = await authUtils.hashPassword(password);
        await accountModel.addAccountModel({
            id: accountUtils.generateRandomString(15),
            mainSystemID: userID,
            name: requestData.name,
            password: hashedPassword,
        });

        const clientID = requestData.client_id;
        const clientAccountData = await accountModel.getAccountModelByMainSystemID({
            id: clientID,
        });

        const userAccountData = await accountModel.getAccountModelByMainSystemID({ id: userID });

        const transactionID = await transactionModel.addTransaction({
            fromAccount: userAccountData.id,
            toAccount: clientAccountData.id,
            amount: requestData.amount,
            requestID: request,
        });
        const userToken = tokenUtils.generateNewToken({ userID });
        await tokenModel.addToken({ token: userToken });
        await tokenModel.deleteToken({ token: code });

        return res.json({
            authorization_code: userToken,
            transaction_id: transactionID.id,
        });
    } catch (err) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }
};

module.exports = {
    getLoginPage,
    loginController,
    registerController,
};
