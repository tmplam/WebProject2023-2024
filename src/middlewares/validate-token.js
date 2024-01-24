const tokenUtils = require('../utils/tokenUtils');
const objectUtils = require('../utils/objectUtils');

const tokenModel = require('../models/token-model');
const clientModel = require('../models/client-model');

const validateToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    try {
        if (!token) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        const tokenData = tokenModel.getToken({ token });
        if (objectUtils.isEmpty(tokenData)) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        const obj = tokenUtils.getObjectFromToken(token);

        const clientData = clientModel.getClientModel({ id: obj.id });

        if (objectUtils.isEmpty(clientData)) {
            throw {
                status: 404,
                message: 'Page not found.',
            };
        }

        next();
    } catch (err) {
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message,
        });
    }
};

const validateAuthorizationCode = async (req, res, next) => {
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
        return res.status(err.status).render('error', {
            status: err.status,
            message: err.message,
        });
    }
};

module.exports = {
    validateToken,
    validateAuthorizationCode,
};
