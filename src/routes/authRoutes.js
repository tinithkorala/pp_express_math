// Third-party imports
const express = require('express');

// Custom imports
const authController = require('./../controllers/authController');
const protected = require('./../middlewares/auth/protected');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/role', protected, authController.setRole);
router.get('/validate-token', protected, authController.verify);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/logout', protected, authController.logout);

module.exports = router;
