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

    // [{fieldName: "price", value: 123, like: true}]
    getSearch: async (tableName, constraintValues, page, perPage, orderField) => {
        let query = `SELECT * FROM "${tableName}"`;
        if (constraintValues) {
            const constraintArray = constraintValues.map((obj) => {
                if (obj.like) {
                    return `LOWER("${obj.fieldName}") LIKE LOWER('%${obj.value}%')`;
                } else {
                    return `"${obj.fieldName}" = '${obj.value}'`;
                }
            });
            query = query + ` WHERE ${constraintArray.join(' AND ')}`;
        }
        if (orderField) {
            query = query + ` ORDER BY "${orderField}"`;
        }
        const data = await db.any(query);
        // Pagination
        const total = data.length;
        const totalPage = Math.floor(total / perPage) + (Number.isInteger(total / perPage) ? 0 : 1);
        const result = data.splice((page - 1) * perPage, perPage);
        return { page, perPage, totalPage, total, result };
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

    updateVer2: async (tableName, entity, constraintValues) => {
        if (constraintValues) {
            const constraintArray = constraintValues.map(
                (obj) => `"${obj.fieldName}" = '${obj.value}'`
            );
            const condition = ` WHERE ${constraintArray.join(' AND ')}`;

            const query =
                pgp.helpers.update(entity, null, tableName) + condition + ` RETURNING "user_id"`;
            const response = await db.oneOrNone(query);
            return response;
        }
    }
};
