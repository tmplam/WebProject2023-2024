require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
};

// Setup utility
// app.use(bodyParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// require('./middlewares/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

// app.get('/login', (req, res, next) => {
//     const passwordError = '(*) Incorrect password!';
//     return res.render('auth/login', {
//         request: 123,
//         name: 'Trần Mỹ Phú Lâm',
//         token: '123',
//         // passwordError,
//     });
// });

// app.get('/sign-up', (req, res, next) => {
//     const passwordError = '(*) Incorrect password!';
//     return res.render('auth/register', {
//         request: 123,
//         name: 'Trần Mỹ Phú Lâm',
//         token: '123',
//         // passwordError,
//     });
// });

// app.get('/payment', (req, res, next) => {
//     res.render('transaction/payment');
// });
// app.get('/payment/success', (req, res, next) => {
//     res.render('transaction/success-payment');
// });
// app.get('/payment/error', (req, res, next) => {
//     res.render('transaction/error-payment');
// });

const authRouter = require('./routers/auth-router');
const transactionRouter = require('./routers/transaction-router');
app.use('/auth', authRouter);
app.use('/transactions', transactionRouter);

const server = https.createServer(options, app);
// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
