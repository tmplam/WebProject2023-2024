const bookModel = require('../models/book.m');
const genreModel = require('../models/genre.m');
const customError = require('../utils/custom-error');

module.exports = {
    homeController: async (req, res, next) => {
        try {
            const genreList = await genreModel.getAll();
            const constraintValues = [
                { fieldName: 'title', value: req.query.keyword || '', like: true },
            ];
            if (req.query.genre && req.query.genre !== 'all') {
                constraintValues.push({
                    fieldName: 'genre',
                    value: req.query.genre,
                });
            }

            const page = req.query.page || 1;
            const bookData = await bookModel.getSearch(constraintValues, page, 8);
            bookData.keyword = req.query.keyword;
            bookData.genre = req.query.genre;
            bookData.page = page;

            res.render('customer/home', { loginUser: req.user, genreList, bookData, home: true });
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
            const totalBook = await bookModel.count();
            const cardInfo = {
                totalBook,
            };

            const earning = [3000, 5000, 1500, 2000, 800];
            res.render('admin/dashboard', {
                loginUser: req.user,
                cardInfo,
                earning,
                dashboard: true,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    productsController: async (req, res, next) => {
        try {
            res.render('admin/products/products', { loginUser: req.user, products: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    createProductController: async (req, res, next) => {
        try {
            res.render('admin/products/create-product', { loginUser: req.user, products: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProductController: async (req, res, next) => {
        try {
            res.render('admin/products/update-product', { loginUser: req.user, products: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
