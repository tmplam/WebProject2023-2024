const db = require('../utils/db');
const tableName = 'users';
const tableId = 'id';


module.exports = class User {
    constructor(obj) {
        this.id = obj?.id;
        this.name = obj?.name;
        this.username = obj?.username;
        this.password = obj?.password;
        this.email = obj?.email;
        this.address = obj?.address;
        this.avatar = obj?.avatar;
        this.role = obj?.role;
        this.created_date = obj?.created_date;
        this.account_number = obj?.account_number;
        this.phone_number = obj?.phone_number;
        this.status = obj?.status || 'active';
    }

    static async get(id) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: tableId, value: id }]);
        const user = new User(response);
        return user;
    }

    static async getByUsername(username) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: 'username', value: username }]);
        const user = new User(response);
        return user;
    }

    static async add(user) {
        const response = await db.insert(tableName, user, tableId);
        return response;
    }

}