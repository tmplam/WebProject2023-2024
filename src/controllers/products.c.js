const bookModel = require('../models/book.m');
const cartModel = require('../models/cart.m');
const genreModel = require('../models/genre.m');
const orderModel = require('../models/order.m');

const customError = require('../utils/custom-error');
const fs = require('fs');
const path = require('path');

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

            let numCartItem = 0;
            if(req.user) {
                numCartItem = await cartModel.getNumItem(req.user.id);
            }
            res.render('customer/home', { loginUser: req.user, genreList, bookData, home: true, numCartItem });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    bookDetailController: async (req, res, next) => {
        try {
            const book = await bookModel.get(req.params.bookId);

            let numCartItem = 0;
            if (req.user) {
                numCartItem = await cartModel.getNumItem(req.user.id);
            }

            book.genre = await genreModel.get(book.genre);
            // let relatedBooks = await bookModel.getAll();
            let relatedBooks = await bookModel.getManyOrNone([
                { fieldName: 'genre', value: book.genre.id },
            ]);
            relatedBooks = relatedBooks.filter((item) => item.id != book.id);

            book.max_quantity = book.stock_quantity;
            if (req?.user) {
                const cart = await cartModel.get(req.user.id);
                const currentIncCart = cart.books.find((product) => product.book_id == book.id);
                if (currentIncCart) {
                    book.max_quantity -= currentIncCart.quantity;
                }
            }

            let successMessage = req.session.successMessage;
            let failMessage = req.session.failMessage;
            delete req.session.successMessage;
            delete req.session.failMessage;

            res.render('customer/detail', {
                loginUser: req.user,
                book,
                relatedBooks,
                successMessage,
                failMessage,
                numCartItem
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    // JUST FOR ADMIN
    dashBoardController: async (req, res, next) => {
        try {
            const totalBook = await bookModel.count();
            const orders = await orderModel.getManyOrNone([
                { fieldName: 'delivery_status', value: 'Shipped' },
            ]);

            const now = new Date();
            const earningYear = orders.reduce((accumulator, order) => {
                if (new Date(order.order_date).getFullYear() == now.getFullYear())
                    return accumulator + Number.parseFloat(order.total_amount);
                return accumulator;
            }, 0);
            const earningMonth = orders.reduce((accumulator, order) => {
                if (new Date(order.order_date).getMonth() == now.getMonth())
                    return accumulator + Number.parseFloat(order.total_amount);
                return accumulator;
            }, 0);

            const cardInfo = {
                totalBook,
                earningYear: earningYear
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                earningMonth: earningMonth
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            };

            // Data for chart
            const earningByYear = [];
            const year = now.getFullYear();
            for (let i = year - 4; i <= year; i++) {
                const earning = orders.reduce((accumulator, order) => {
                    if (new Date(order.order_date).getFullYear() == i)
                        return accumulator + Number.parseFloat(order.total_amount);
                    return accumulator;
                }, 0);
                earningByYear.push({ year: i, earning: earning });
            }

            const earning = [3000, 5000, 1500, 2000, 800];
            res.render('admin/dashboard', {
                loginUser: req.user,
                cardInfo,
                earning,
                earningByYear: JSON.stringify(earningByYear),
                dashboard: true,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    productsController: async (req, res, next) => {
        try {
            const productList = await bookModel.getAll();
            for (let book of productList) {
                const genre = await genreModel.get(book.genre);
                book.genre = genre.name;
            }
            const addSuccess = req.session.addSuccess;
            const deleteSuccess = req.session.deleteSuccess;
            delete req.session.addSuccess;
            delete req.session.deleteSuccess;
            res.render('admin/products/products', {
                loginUser: req.user,
                products: true,
                productList: productList,
                addSuccess,
                deleteSuccess
            });
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
                genreList: genreList,
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    createProductControllerPost: async (req, res, next) => {
        try {
            //validate
            //if invalid then delete req.files and throw error

            const book = {
                author: req.body.author,
                isbn: req.body.isbn,
                title: req.body.title,
                genre: req.body.genre,
                price: req.body.price,
                stock_quantity: req.body.quantity,
                description: req.body.description,
                status: 'active'
            };

            let i = 1;
            for (let file of req.files) {
                const ext = file.mimetype.substring(file.mimetype.indexOf('/') + 1);
                const oldPath = file.path;
                if (i == 1) {
                    const newPath = path.join(
                        file.destination,
                        `front-cover/${file.filename}.${ext}`
                    );
                    fs.renameSync(oldPath, newPath);
                    book.front_cover_image = `/images/products/front-cover/${file.filename}.${ext}`;
                } else {
                    const newPath = path.join(
                        file.destination,
                        `back-cover/${file.filename}.${ext}`
                    );
                    fs.renameSync(oldPath, newPath);
                    book.back_cover_image = `/images/products/back-cover/${file.filename}.${ext}`;
                }
                i = i + 1;
            }

            //add to database
            await bookModel.add(book);
            req.session.addSuccess = 'success';
            res.redirect('/admin/products');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProductController: async (req, res, next) => {
        try {
            const bookId = req.params.productId;
            const book = await bookModel.get(bookId);

            if (!book) {
                throw new customError('Can not find this book!', 404);
            }

            const genre = await genreModel.get(book.genre);
            book.genre = genre.name;
            const genreList = await genreModel.getAll();

            const updateSuccess = req.session.updateSuccess;
            delete req.session.updateSuccess;
            //render update
            res.render('admin/products/update-product', {
                loginUser: req.user,
                products: true,
                book: book,
                genreList: genreList,
                updateSuccess
            });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateProductControllerPost: async (req, res, next) => {
        try {
            const bookId = req.params.productId;
            const book = await bookModel.get(bookId);

            if (!book) {
                throw new customError('Can not find this book!', 404);
            }

            book.author = req.body.author;
            book.isbn = req.body.isbn;
            book.title = req.body.title;
            book.genre = req.body.genre;
            book.description = req.body.description;
            book.price = Number(req.body.price);
            book.stock_quantity = Number(req.body.quantity);

            //update cover img
            let i = 1;
            for (let file of req.files) {
                const ext = file.mimetype.substring(file.mimetype.indexOf('/') + 1);
                const oldPath = file.path;
                if (i == 1) {
                    const newPath = path.join(
                        file.destination,
                        `front-cover/${file.filename}.${ext}`
                    );
                    fs.renameSync(oldPath, newPath);
                    //delete old image
                    fs.unlinkSync(path.join(__dirname, '../', `/public${book.front_cover_image}`));
                    book.front_cover_image = `/images/products/front-cover/${file.filename}.${ext}`;
                } else {
                    const newPath = path.join(
                        file.destination,
                        `back-cover/${file.filename}.${ext}`
                    );
                    fs.renameSync(oldPath, newPath);
                    //delete old image
                    fs.unlinkSync(path.join(__dirname, '../', `/public${book.back_cover_image}`));
                    book.back_cover_image = `/images/products/back-cover/${file.filename}.${ext}`;
                }
                i = i + 1;
            }
            await bookModel.update(book, bookId);

            //render update
            req.session.updateSuccess = 'success';
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    deleteProductController: async (req, res, next) => {
        try {
            const bookId = req.params.productId;
            const book = await bookModel.get(bookId);
            if(book) {
                book.status = 'delete';
                await bookModel.update(book, bookId);
                req.session.deleteSuccess = 'success';
                res.redirect('/admin/products')
            }
            else {
                throw new customError('Can not find this book!', 404);
            }
        } catch (error) {
            next(new customError(error.message, 503));
        }
    }
};
