require('dotenv').config()
const pg = require('pg-promise')()
const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 100
}
const postgresDB = pg(connection);


module.exports = postgresDB