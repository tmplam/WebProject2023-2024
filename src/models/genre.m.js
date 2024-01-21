const db = require('../utils/db');
const tableName = 'genres';
const tableId = 'id';

module.exports = class User {
    constructor(obj) {
        this.id = obj?.id;
        this.name = obj?.name;
    }

    static async get(id) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: tableId, value: id }]);
        const user = new User(response);
        return user;
    }

    static async add(genre) {
        const response = await db.insert(tableName, user, tableId);
        return response;
    }
};
