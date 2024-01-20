const db = require('../utils/db');
const tableName = 'books';
const tableId = 'id';

module.exports = class Book {
    constructor(obj) {
        this.id = obj?.id;
        this.author = obj?.author;
        this.publisher = obj?.publisher;
        this.title = obj?.title;
        this.full_title = obj?.full_title;
        this.genre = obj?.genre;
        this.description = obj?.description;
        this.isbn = obj?.isbn;
        this.price = obj?.price ? Number.parseFloat(obj?.price) : 0;
        this.stock_quantity = obj?.stock_quantity ? Number.parseInt(obj?.stock_quantity) : 0;
        this.front_cover_image = obj?.front_cover_image;
        this.back_cover_image = obj?.back_cover_image;
    }

    static async add(book) {
        const response = await db.insert(tableName, book, tableId);
        return response;
    }

    static async get(bookId) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: tableId, value: bookId }]);
        const book = new Book(response);
        return book;
    }

    static async getAll() {
        const response = await db.getAll(tableName);
        const bookList = response.map((book) => new Book(book));
        return bookList;
    }

    static async getManyOrNone(constraintValues) {
        const response = await db.getManyOrNone(tableName, constraintValues);
        const bookList = response.map((book) => new Book(book));
        return bookList;
    }

    static async delete(bookId) {
        await db.delete(tableName, [{ fieldName: tableId, value: bookId }]);
    }

    static async update(book, bookId) {
        const response = await db.update(tableName, book, tableId, bookId);
        return response;
    }
};
