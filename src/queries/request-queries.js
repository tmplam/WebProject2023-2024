const pg = require('../databases/postgreSQL')

const getClientRequest = async ({ id }) => {
    const queryString = 'select * from client_requests where id = $1'
    const values = [id]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const requestData = await postgresConnection.any(queryString, values)
        const formattedData = requestData.length === 0 ? {} : requestData[0]
        return formattedData
    }
    catch (err) {
        throw {
            status: 500,
            message: 'Internal Server Error'
        }
    }
    finally {
        postgresConnection.done()
    }
}

const addClientRequest = async ({ clientID, userID, name, amount, orderID }) => {
    const queryString = 'insert into client_requests("client_id", "user_id", "name", "amount", "order_id") values($1, $2, $3, $4, $5) returning id'
    const values = [clientID, userID, name, amount, orderID]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const id = await postgresConnection.any(queryString, values)
        return id[0]
    }
    catch (err) {
        throw {
            status: 500,
            message: 'Internal Server Error'
        }
    }
    finally {
        postgresConnection.done()
    }
}

module.exports = {
    getClientRequest,
    addClientRequest
}