
const jwt = require('jsonwebtoken')


// .env
require('dotenv').config()
const secretKey = process.env.TOKEN_SECRET_KEY


const generateNewToken = (obj) => {
    try {
        //create token has 60 minutes expires
        const newToken = jwt.sign(obj, secretKey, {expiresIn: 3600})
        
        return newToken
    }
    catch (err) {
        throw {
            status: 404,
            message: 'Page not found.'
        }
    }
}

const getObjectFromToken = (token) => {
    try {
        const obj = jwt.verify(token, secretKey)
        return obj
    }
    catch (err) {
        throw {
            status: 404,
            message: 'Page not found.'
        }
    }
}

module.exports = {
    generateNewToken,
    getObjectFromToken
}