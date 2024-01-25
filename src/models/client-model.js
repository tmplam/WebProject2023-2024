const clientQueries = require('../queries/client-queries')
const objectUtils = require('../utils/objectUtils')

module.exports = class Client {
    constructor(client) {
        this.id = client.id
        this.name = client.name
        this.callback_url = client.callback_url
        this.code = client.code
    }

    static getClientModel = async ({ id }) => {
        const clientData = await clientQueries.getClientQuery({ id })

        if (!objectUtils.isEmpty(clientData)) {
            return new Client(clientData)
        }
        return {}
    }
}