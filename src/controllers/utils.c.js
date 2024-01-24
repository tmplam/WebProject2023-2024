const customError = require('../utils/custom-error');

module.exports = {
    toggleDarkMode: async (req, res, next) => {
        try {
            req.session.darkMode = req.body.darkMode;
            res.json({ success: true });
        } catch (err) {
            throw new customError(err.message, 503);
        }
    },
};
