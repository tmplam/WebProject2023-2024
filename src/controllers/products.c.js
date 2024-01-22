const bookModel = require('../models/book.m');
const genreModel = require('../models/genre.m');
const customError = require('../utils/custom-error');

module.exports = {
    homeController: async (req, res, next) => {
        try {
            const bookList = await bookModel.getAll();
            res.render('customer/home', { loginUser: req.user, bookList, home: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    bookDetailController: async (req, res, next) => {
        try {
            const book = await bookModel.get(req.params.bookId);
            res.render('customer/detail', { loginUser: req.user, book });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    // JUST FOR ADMIN
    dashBoardController: async (req, res, next) => {
        try {
            res.render('admin/dashboard', { loginUser: req.user, dashboard: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    productsController: async (req, res, next) => {
        try {
            const productList = await bookModel.getAll();
            for(let book of productList) {
                const genre = await genreModel.get(book.genre);
                book.genre = genre.name;
            }

            res.render('admin/products/products', { loginUser: req.user, products: true, productList: productList });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    createProductController: async (req, res, next) => {
        try {
            const genreList = await genreModel.getAll();
            res.render('admin/products/create-product', { 
                loginUser: req.user, 
                products: true,
                genreList: genreList
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProductController: async (req, res, next) => {
        try {
            const bookId = req.params.productId;
            const book = await bookModel.get(bookId);

            if(!book) {
                throw new customError('Can not find this book!', 404);
            }

            const genre = await genreModel.get(book.genre);
            book.genre = genre.name;
            const genreList = await genreModel.getAll();

            //render update
            res.render('admin/products/update-product', { 
                loginUser: req.user,
                products: true,
                book: book,
                genreList: genreList
            });

        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
