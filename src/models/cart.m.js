const db = require('../utils/db');
const tableName = 'shopping_cart_details';

module.exports = class Cart {
    constructor(obj) {
        this.user_id = obj?.user_id;
        this.books = obj.books;
    }

    static async get(user_id) {
        const response = await db.getManyOrNone(tableName, [
            { fieldName: 'user_id', value: user_id },
        ]);
        const temp = {
            user_id: user_id,
            books: [],
        };

        if (response.length > 0) {
            for (let item of response) {
                temp.books.push({
                    book_id: item.book_id,
                    quantity: item.quantity,
                });
            }
        }

        const cart = new Cart(temp);
        return cart;
    }

    static async add(item) {
        const user_id = item.user_id;
        const book_id = item.book_id;
        const quantity = item.quantity;

        let cartItem = await db.getOneOrNone(tableName, [
            { fieldName: 'user_id', value: user_id },
            { fieldName: 'book_id', value: book_id },
        ]);

        //da mua truoc do
        if (cartItem) {
            cartItem.quantity = cartItem.quantity + quantity;
            await db.updateVer2(tableName, cartItem, [
                { fieldName: 'user_id', value: user_id },
                { fieldName: 'book_id', value: book_id },
            ]);
        } else {
            //chua mua truoc do
            cartItem = {
                user_id,
                book_id,
                quantity,
            };
            await db.insert(tableName, cartItem, 'user_id');
        }
    }

    static async delete(user_id, book_id) {
        await db.delete(tableName, [
            { fieldName: 'user_id', value: user_id },
            { fieldName: 'book_id', value: book_id },
        ]);
    }

    static async deleteCart(user_id) {
        await db.delete(tableName, [{ fieldName: 'user_id', value: user_id }]);
    }

    static async deleteZeroQuantity(user_id, book_id) {
        await db.delete(tableName, [
            { fieldName: 'user_id', value: user_id },
            { fieldName: 'book_id', value: book_id },
            { fieldName: 'quantity', value: 0 },
        ]);
    }

    static async getNumItem(user_id) {
        const data = await db.getCount(tableName, [{ fieldName: 'user_id', value: user_id }]);
        if (data) {
            return Number(data.count);
        }
        return 0;
    }

    static async updateCartItem(cartItem) {
        await db.updateVer2(tableName, cartItem, [
            { fieldName: 'user_id', value: cartItem.user_id },
            { fieldName: 'book_id', value: cartItem.book_id },
        ]);
    }

    static async getAllCartItemsOfBook(book_id) {
        const response = db.getManyOrNone(tableName, [{ fieldName: 'book_id', value: book_id }]);
        return response;
    }
};
