const bookModel = require('../models/book.m');
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
