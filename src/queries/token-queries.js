const pg = require('../databases/postgreSQL')

const getToken = async ({ token }) => {
    const queryString = 'select * from tokens where value = $1'
    const values = [id]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        const tokenData = await postgresConnection.any(queryString, values)
        const formattedData = tokenData.length === 0 ? {} : tokenData[0]
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

const addToken = async ({ token }) => {
    const queryString = 'insert into tokens("value") values($1)'
    const values = [token]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        await postgresConnection.none(queryString, values)
        return true
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

//delete a token
const deleteToken = async ({ token }) => {
    const queryString = 'delete from tokens where value = $1'
    const values = [token]
    let postgresConnection
    try {
        postgresConnection = await pg.connect()
        await postgresConnection.none(queryString, values)
        return true
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


const clearTOKENS = async () => {
    const queryString = `delete from tokens
                        where (current_timestamp > (created_time + '10 minutes'));`

    try {
        await postgres.query(queryString);
    }
    catch (err) {
        throw new Error('Internal Server Error');
    }
}

module.exports = {
    addToken, getToken, deleteToken, clearTOKENS
}