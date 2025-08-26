const express = require('express');
const PasswordController = require('../controllers/passwordController');
const router = express.Router();

router.post('/forgot', PasswordController.forgotPassword);
router.post('/verify', PasswordController.verifyOtp);
router.post('/reset', PasswordController.resetPassword);

module.exports = router;
