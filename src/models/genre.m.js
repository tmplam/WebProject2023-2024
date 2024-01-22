const db = require('../utils/db');
const tableName = 'genres';
const tableId = 'id';

module.exports = class Genre {
    constructor(obj) {
        this.id = obj?.id;
        this.name = obj?.name;
    }

    static async get(id) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: tableId, value: id }]);
        if(response) {
            const genre = new Genre(response);
            return genre;
        }
        return null;
    }

    static async getAll() {
        const response = await db.getAll(tableName);
        const genreList = response.map((genre) => new Genre(genre));
        return genreList;
    }

    static async add(genre) {
        const response = await db.insert(tableName, genre, tableId);
        return response;
    }
};
