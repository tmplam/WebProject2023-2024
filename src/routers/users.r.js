const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.c');
const multer = require('multer');
const path = require('path');

//create storagte for avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../', 'public/images/users/avatars');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const arr = file.originalname.split('.');
        const ext = arr[arr.length - 1];
        const fieldName = req.user?.id + '.' + ext;
        req.body.avatar = fieldName;
        console.log(fieldName);
        cb(null, fieldName);
    }
})

const upload = multer({ storage: storage })


router.get('/customer/profile', usersController.userProfileController);
router.post('/customer/profile/:customerId', upload.single('avatar'), usersController.updateProfileController);

module.exports = router;
