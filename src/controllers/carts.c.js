const cartModel = require('../models/cart.m');
const bookModel = require('../models/book.m');
const genreModel = require('../models/genre.m');
const customError = require('../utils/custom-error');

module.exports = {
    cartController: async (req, res, next) => {
        try {
            const cartInfo = await cartModel.get(req.user.id);
            if(cartInfo.books.length > 0) {
                for(let book of cartInfo.books) {
                    book.bookInfo = await bookModel.get(book.book_id);
                    const genre = await genreModel.get(book.bookInfo.genre);
                    book.bookInfo.genre = genre.name;
                }
            }
            
            const numCartItem = await cartModel.getNumItem(req.user.id);

            res.render('customer/cart', { 
                loginUser: req.user, 
                cart: true,
                cartInfo: cartInfo,
                numCartItem
            });
        }
        catch(err) {
            next(new customError(err.message, 503));
        }
        
    },

    addToCartController: async (req, res, next) => {
        let book;
        try {
            const bookId = req.params.bookId;
            const userId = req.user.id;
            const quantity = Number(req.body.quantity);

            book = await bookModel.get(bookId);
            if(book.stock_quantity < quantity) {
                throw new customError('The stock quantity is insufficient!', 400);
            }
            else if(book.status === 'delete') {
                throw new customError('This was deleted!', 400);
            }

            await cartModel.add({
                user_id: userId,
                book_id: bookId,
                quantity: quantity
            })

            //re render book detail
            const numCartItem = await cartModel.getNumItem(req.user.id);
            res.render('customer/detail', { loginUser: req.user, book , successAddToCart: true, numCartItem });
        }
        catch(err) {
            const numCartItem = await cartModel.getNumItem(req.user.id);
            res.render('customer/detail', { loginUser: req.user, book, failureAddToCart: true, numCartItem })
        }
    },


    updateCartController: async (req, res, next) => {
        try {
            const bookId = req.query.bookId;
            const userId = req.user.id;
            const operate = req.params.operate;
            if(operate === 'increase') {
                await cartModel.add({
                    user_id: userId,
                    book_id: bookId,
                    quantity: 1
                })
            }
            else if(operate === 'descrease') {
                await cartModel.add({
                    user_id: userId,
                    book_id: bookId,
                    quantity: -1
                })
                await cartModel.deleteZeroQuantity(userId, bookId);
            }
            res.redirect('/customer/cart')
        }
        catch(err) {
            next(new customError(err.message, 503));
        }
    },

    deleteCartController: async (req, res, next) => {
        try {
            const bookId = req.query.bookId;
            const userId = req.user.id;
            await cartModel.delete(userId, bookId);
            res.redirect('/customer/cart')
        }catch(err) {
            next(new customError(err.message, 503));
        }
    }

};
