const tokenUtils = require('../utils/tokenUtils')
const objectUtils = require('../utils/objectUtils')

const tokenModel = require('../models/token-model')
const clientModel = require('../models/client-model')

const validateToken = async (req, res) => {
    const token = req.headers['authorization']
    try {
        if (!token) {
            throw {

            }
        }

        const tokenData = tokenModel.getToken({ token })
        if (objectUtils.isEmpty(tokenData)) {
            throw {

            }
        }

        const obj = tokenUtils.getObjectFromToken(token)

        const clientData = clientModel.getClientModel({ id: obj.id })

        if (objectUtils.isEmpty(clientData)) {
            throw {

            }
        }

        next()
    }
    catch (err) {
        return res.render('error', {})
    }
}



module.exports = validateToken