const genreModel = require('../models/genre.m');
const customError = require('../utils/custom-error');

module.exports = {
    // JUST FOR ADMIN
    genresController: async (req, res, next) => {
        try {
            const genreList = await genreModel.getAll();
            for (let i = 0; i < genreList.length; i++) {
                genreList[i].numOfBooks = await genreModel.getNumOfBooks(genreList[i].id);
            }

            res.render('admin/genres', { loginUser: req.user, genreList, genres: true });
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateGenreController: async (req, res, next) => {
        try {
            const data = {
                name: req.body.name,
            };
            await genreModel.update(data, req.params.genreId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    createGenreController: async (req, res, next) => {
        try {
            const data = {
                name: req.body.name,
            };
            await genreModel.add(data);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    updateGenreController: async (req, res, next) => {
        try {
            const data = {
                name: req.body.name,
            };
            await genreModel.update(data, req.params.genreId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },

    deleteGenreController: async (req, res, next) => {
        try {
            await genreModel.delete(req.params.genreId);
            res.redirect('back');
        } catch (error) {
            next(new customError(error.message, 503));
        }
    },
};
