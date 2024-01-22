const clientModel = require('../models/client-model')
const requestModel = require('../models/request-model')
const tokenModel = require('../models/token-model')
const objectUtils = require('../utils/objectUtils')
const tokenUtils = require('../utils/tokenUtils')

const handleTransactionRequestFromClient = async (req, res) => {
    const clientID = req.body['client-id']
    const userID = req.body['user-id']
    const name = req.body['name']
    const amount = req.body['amount']

    try {
        const clientData = await clientModel.getClientModel({ id: clientID })

        if (objectUtils.isEmpty(clientData)) {
            throw {
                status: 400,
                message: 'Invalid client ID'
            }
        }

        const requestID = await requestModel.addRequest({ clientID, userID, name, amount })

        const newToken = tokenUtils.generateNewToken({ id: clientData.id })

        await tokenModel.addToken({ token: newToken })

        return res.json({
            status: 200,
            accessToken: newToken,
            requestID: requestID.id
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
    handleTransactionRequestFromClient
}