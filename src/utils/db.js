require('dotenv').config();
const pgp = require('pg-promise')();

const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 30,
};

const db = pgp(connection);

module.exports = {
    insert: async (tableName, entity, idName = 'ID') => {
        const query = pgp.helpers.insert(entity, null, tableName);
        const data = await db.one(query + ` RETURNING "${idName}"`);
        return data;
    },

    get: async (tableName, fieldName, value) => {
        const data = await db.oneOrNone(
            `SELECT * FROM "${tableName}" WHERE "${fieldName}" = '${value}'`
        );
        return data;
    },

    getAll: async (tableName, orderField) => {
        let query = `SELECT * FROM "${tableName}"`;
        if (orderField) {
            query = query + ` ORDER BY "${orderField}"`;
        }
        const data = await db.any(query);
        return data;
    },

    getAllOnField: async (tableName, fieldName, value) => {
        const data = await db.any(`SELECT * FROM "${tableName}" WHERE "${fieldName}" = '${value}'`);
        return data;
    },

    update: async (tableName, entity, idName = 'ID', idValue) => {
        const condition = pgp.as.format(` WHERE "${idName}" = '${idValue}'`, entity);
        const query =
            pgp.helpers.update(entity, null, tableName) + condition + ` RETURNING "${idName}"`;
        const response = await db.oneOrNone(query);
        return response;
    },

    delete: async (tableName, idName = 'ID', idValue) => {
        await db.none(`DELETE FROM "${tableName}" WHERE "${idName}" = '${idValue}'`);
    },

    getMax: async (tableName, fieldName) => {
        const data = await db.oneOrNone(`SELECT MAX("${fieldName}") FROM "${tableName}"`);
        return data;
    },
};
