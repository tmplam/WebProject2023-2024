const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utils.c');

router.post('/dark-mode', utilsController.toggleDarkMode);

module.exports = router;
