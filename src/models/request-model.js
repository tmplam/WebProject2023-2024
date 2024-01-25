const requestQueries = require('../queries/request-queries')
const objectUtils = require('../utils/objectUtils')

module.exports = class Request {
    constructor(request) {
        this.id = request.id
        this.client_id = request.client_id
        this.user_id = request.user_id
        this.name = request.name
        this.order_id = request.order_id
        this.amount = request.amount
        this.created_time = request.created_time
    }

    static getRequest = async ({ id }) => {
        const requestData = await requestQueries.getClientRequest({ id })

        if (!objectUtils.isEmpty(requestData)) {
            return new Request(requestData)
        }
        return {}
    }

    static addRequest = async ({ clientID, userID, name, amount , orderID}) => {
        return await requestQueries.addClientRequest({ clientID, userID, name, amount, orderID })
    }
}