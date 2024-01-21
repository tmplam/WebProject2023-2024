const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.c');

router.get('/customer/profile', usersController.userProfileController);

module.exports = router;
