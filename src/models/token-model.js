const tokenQueries = require('../queries/token-queries')
const objectUtils = require('../utils/objectUtils')

module.exports = class Token {
    constructor(token) {
        this.id = token.id
        this.value = token.value
        this.created_time = token.created_time
    }

    static getToken = async ({ token }) => {
        const tokenData = await tokenQueries.getToken({ token })

        if (!objectUtils.isEmpty(tokenData)) {
            return new Token(tokenData)
        }
        return {}
    }

    static addToken = async ({ token }) => {
        return await tokenQueries.addToken({ token })
    }

    static deleteToken = async({token}) => {
        return await tokenQueries.deleteToken({token})
    }
}