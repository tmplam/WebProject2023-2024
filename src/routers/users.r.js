const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.c');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//create storagte for avatar
const upload = multer({ dest: path.join(__dirname, '../public/images/users/avatars') })


router.get('/customer/profile', usersController.userProfileController);
router.post('/customer/profile', upload.single('avatar'), usersController.updateProfileController);

module.exports = router;
