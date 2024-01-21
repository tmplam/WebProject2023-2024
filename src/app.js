require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Import models here to get data to test!!!
const bookModel = require('./models/book.m');

// Setup utility
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// require('./middlewares/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

const httpServer = require('http').createServer(app);
// Setup socket (if any)
require('./utils/custom-passport')(app);
const customError = require('./utils/custom-error');

// SET UP ROUTER
// app.use((req, res, next) => {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('/auth/signin');
//     }
// });


// Main page of game
app.get('/', async (req, res, next) => {
    try {
        const bookList = await bookModel.getAll();
        res.render('customer/home', { loginUser: req.user, bookList });
    } catch (error) {
        next(new customError(error.message, 503));
    }
});

const authRouter = require('./router/AuthRouter');
app.use('/', authRouter);

app.get('/customer/profile', (req, res, next) => {
    console.log(req.user);
    res.render('customer/profile', {});
});

app.get('/customer/cart', (req, res, next) => {
    res.render('customer/cart', {});
});

app.get('/customer/detail/:bookId', async (req, res, next) => {
    try {
        const book = await bookModel.get(req.params.bookId);
        res.render('customer/detail', { book });
    } catch (error) {
        next(new customError(error.message, 503));
    }
});

app.get('/customer/summary', async (req, res, next) => {
    try {
        res.render('customer/summary', { loginUser: req.user });
    } catch (error) {
        next(new customError(error.message, 503));
    }
});


///check role here
app.use('/', (req, res, next) => {
    if(req.user.role !== 2) {
        throw new customError('Unauthorized!', 401);
    }
    next();
})

app.get('/admin/dashboard', async (req, res, next) => {
    try {
        res.render('admin/dashboard', { loginUser: req.user, dashboard: true });
    } catch (error) {
        next(new customError(error.message, 503));
    }
});

app.get('/admin/genres', (req, res, next) => {
    res.render('admin/genres/genres', { genres: true });
});

app.get('/admin/customers', (req, res, next) => {
    res.render('admin/customers', { customers: true });
});

app.get('/admin/orders', (req, res, next) => {
    res.render('admin/orders', { orders: true });
});

app.get('/admin/orders/:orderId/detail', (req, res, next) => {
    res.render('admin/order-detail', { orders: true });
});

// PRODUCTS
app.get('/admin/products', (req, res, next) => {
    res.render('admin/products/products', { products: true });
});

app.get('/admin/products/create', (req, res, next) => {
    res.render('admin/products/create-product', { products: true });
});

app.get('/admin/products/:productId/edit', (req, res, next) => {
    res.render('admin/products/update-product', { products: true });
});

// Catch exceptions
require('./middlewares/error-handler')(app);

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
