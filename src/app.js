require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

app.set('views', './src/views');
app.set('view engine', 'ejs');

const httpServer = require('http').createServer(app);
// Setup socket (if any)
require('./utils/custom-passport')(app);
const customError = require('./utils/custom-error');

// Main page of game
const authRouter = require('./routers/auth.r');
const productsRouter = require('./routers/products.r');
const cartsRouter = require('./routers/carts.r');
const ordersRouter = require('./routers/orders.r');
const usersRouter = require('./routers/users.r');
const adminRouter = require('./routers/admin.r');
const utilsRouter = require('./routers/utils.r');

app.use('/auth', authRouter);
app.use('/', productsRouter);
app.use('/utils', utilsRouter);

// AUTHENTICATION
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect('/auth/login');
});

app.use('/', cartsRouter);
app.use('/', ordersRouter);
app.use('/', usersRouter);

// AUTHORIZATION
app.use('/', (req, res, next) => {
    if (req?.user?.role !== 2) {
        throw new customError('Unauthorized!', 401);
    }
    next();
});

app.use('/admin', adminRouter);

// Catch exceptions
require('./middlewares/error-handler')(app);

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
