const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utils.c');

router.post('/dark-mode', utilsController.toggleDarkMode);
router.get('/payment/:orderId/callback', utilsController.paymentCallBack);

module.exports = router;
