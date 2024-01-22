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

    static async getNumOfBooks(genreId) {
        const response = await db.getCount('books', [{ fieldName: 'genre', value: genreId }]);
        return response.count;
    }

    static async getAll() {
        const response = await db.getAll(tableName, tableId);
        const genreList = response.map((genre) => new Genre(genre));
        return genreList;
    }

    static async add(genre) {
        const response = await db.insert(tableName, genre, tableId);
        return response;
    }

    static async update(genre, genreId) {
        const response = await db.update(tableName, genre, tableId, genreId);
        return response;
    }

    static async delete(genreId) {
        await db.delete(tableName, [{ fieldName: tableId, value: genreId }]);
    }
};
