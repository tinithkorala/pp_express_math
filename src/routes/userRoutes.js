const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const protected = require('./../middlewares/auth/protected');
const userPhotoUpload = require('../middlewares/multerHandlers/userPhotoUpload');
const resizeUserPhoto = require('../middlewares/multerHandlers/userPhotoResize');

const router = express.Router();

router.use(protected);

router.patch(
  '/update-me',
  userPhotoUpload,
  resizeUserPhoto,
  userController.update
);

module.exports = router;
