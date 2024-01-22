const pg = require('../databases/postgreSQL')

const getAccountQuery = async ({ id }) => {
    const queryString = 'select * from accounts where id = $1'
    const values = [id]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const accountData = await postgresConnection.any(queryString, values)
        const formattedData = accountData.length === 0 ? {} : accountData[0]
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

const getAccountByMainSystemIDQuery = async ({ id }) => {
    const queryString = 'select * from accounts where main_system_id = $1'
    const values = [id]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const accountData = await postgresConnection.any(queryString, values)
        const formattedData = accountData.length === 0 ? {} : accountData[0]
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
    getAccountQuery,
    getAccountByMainSystemIDQuery
}