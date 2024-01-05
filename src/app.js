require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Setup utility
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
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
        res.render('admin/dashboard', { loginUser: req.user });
    } catch (error) {
        next(new customError(error.message, 503));
    }
});

app.get('/customer', async (req, res, next) => {
    try {
        res.render('customer/home', { loginUser: req.user });
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

// Catch exceptions
require('./middlewares/error-handler')(app);

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
