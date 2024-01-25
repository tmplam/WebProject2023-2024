const pg = require('../databases/postgreSQL');

const getTransactionQuery = async ({ id }) => {
    const queryString = `select * from transactions where id = $1`;
    const values = [id];
    let postgresConnection;
    try {
        postgresConnection = await pg.connect();
        const transactionData = await postgresConnection.any(queryString, values);
        const formattedData = transactionData.length === 0 ? {} : transactionData[0];
        return formattedData;
    } catch (err) {
        throw {
            status: 500,
            message: 'Internal Server Error',
        };
    } finally {
        postgresConnection.done();
    }
};

const addTransactionQuery = async ({ fromAccount, toAccount, amount, requestID }) => {
    const queryString =
        "insert into transactions(from_account, to_account, amount, status, request_id) values($1, $2, $3, 'Pending', $4) returning id";
    const values = [fromAccount, toAccount, amount, requestID];
    let postgresConnection;
    try {
        postgresConnection = await pg.connect();
        const id = await postgresConnection.any(queryString, values);
        return id[0];
    } catch (err) {
        throw {
            status: 500,
            message: 'Internal Server Error',
        };
    } finally {
        postgresConnection.done();
    }
};

const updateTransactionQuery = async ({ status, message, id }) => {
    const queryString = 'update transactions set status = $1, message = $2 where id = $3';
    const values = [status, message, id];
    let postgresConnection;
    try {
        postgresConnection = await pg.connect();
        await postgresConnection.none(queryString, values);
        return true;
    } catch (err) {
        throw {
            status: 500,
            message: 'Internal Server Error',
        };
    } finally {
        postgresConnection.done();
    }
};

module.exports = {
    getTransactionQuery,
    addTransactionQuery,
    updateTransactionQuery,
};
