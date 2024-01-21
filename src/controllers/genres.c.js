const genreModel = require('../models/genre.m');
const customError = require('../utils/custom-error');

module.exports = {
    // JUST FOR ADMIN
    genresController: async (req, res, next) => {
        try {
            res.render('admin/genres', { loginUser: req.user, genres: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
