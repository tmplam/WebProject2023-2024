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

    // [{fieldName: "price", value: 123}]
    getOneOrNone: async (tableName, constraintValues) => {
        const constraintArray = constraintValues.map(
            (obj) => `"${obj.fieldName}" = '${obj.value}'`
        );
        const data = await db.oneOrNone(
            `SELECT * FROM "${tableName}" WHERE ${constraintArray.join(' AND ')}`
        );
        return data;
    },

    // [{fieldName: "price", value: 123}]
    getManyOrNone: async (tableName, constraintValues) => {
        let query = `SELECT * FROM "${tableName}"`;
        if (constraintValues) {
            const constraintArray = constraintValues.map(
                (obj) => `"${obj.fieldName}" = '${obj.value}'`
            );
            query = query + ` WHERE ${constraintArray.join(' AND ')}`;
        }
        const data = await db.any(query);
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

    update: async (tableName, entity, idName, idValue) => {
        const condition = pgp.as.format(` WHERE "${idName}" = '${idValue}'`, entity);
        const query =
            pgp.helpers.update(entity, null, tableName) + condition + ` RETURNING "${idName}"`;
        const response = await db.oneOrNone(query);
        return response;
    },

    // [{fieldName: "price", value: 123}]
    delete: async (tableName, constraintValues) => {
        const constraintArray = constraintValues.map(
            (obj) => `"${obj.fieldName}" = '${obj.value}'`
        );

        await db.none(`DELETE FROM "${tableName}" WHERE ${constraintArray.join(' AND ')}`);
    },

    getMax: async (tableName, fieldName) => {
        const data = await db.oneOrNone(`SELECT MAX("${fieldName}") FROM "${tableName}"`);
        return data;
    },

    // [{fieldName: "price", value: 123}]
    getCount: async (tableName, constraintValues) => {
        let query = `SELECT COUNT(*) FROM "${tableName}"`;

        if (constraintValues) {
            const constraintArray = constraintValues.map(
                (obj) => `"${obj.fieldName}" = '${obj.value}'`
            );
            query = query + ` WHERE ${constraintArray.join(' AND ')}`;
        }

        const data = await db.oneOrNone(query);
        return data;
    },
};
