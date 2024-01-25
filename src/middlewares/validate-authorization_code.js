const tokenUtils = require('../utils/tokenUtils');
const objectUtils = require('../utils/objectUtils');

const tokenModel = require('../models/token-model');
const clientModel = require('../models/client-model');

const validateAuthorizationCodeAndReturnPage = async (req, res, next) => {
    const code = req.query['authorization_code'];
    try {
        if (!code) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        const tokenData = await tokenModel.getToken({ token: code });
        if (objectUtils.isEmpty(tokenData)) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }
        const obj = tokenUtils.getObjectFromToken(code);

        next();
    } catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message,
        });
    }
};

const validateAuthorizationCodeAndReturnJSON = async (req, res, next) => {
    const code = req.query['authorization_code'] || req.headers['authorization_code'];
    try {
        if (!code) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }
        const tokenData = await tokenModel.getToken({ token: code });

        if (objectUtils.isEmpty(tokenData)) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        const obj = tokenUtils.getObjectFromToken(code);
        next();
    } catch (err) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }
};

module.exports = {
    validateAuthorizationCodeAndReturnJSON,
    validateAuthorizationCodeAndReturnPage,
};
