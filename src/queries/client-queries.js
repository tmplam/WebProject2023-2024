const pg = require('../databases/postgreSQL')

const getClientQuery = async ({ id }) => {
    const queryString = 'select * from clients where id = $1'
    const values = [id]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const clientData = await postgresConnection.any(queryString, values)
        const formattedData = clientData.length === 0 ? {} : clientData[0] 
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

module.exports = {
    getClientQuery
}