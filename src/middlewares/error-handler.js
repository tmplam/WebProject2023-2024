const CustomError = require('../utils/custom-error');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.status(400).render('error', {
            statusCode: 400,
            message: 'Page not found!',
            description: 'The page you access is not existed!',
        });
    });

    app.use((err, req, res, next) => {
        let statusCode = 500;
        if (err instanceof CustomError) {
            statusCode = err.statusCode;
        }

        res.status(statusCode).render('error', {
            statusCode: statusCode,
            message: err.message,
            description: err.stack,
        });
    });
};
