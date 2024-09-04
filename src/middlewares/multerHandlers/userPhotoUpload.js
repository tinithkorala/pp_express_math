const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../../services/errorService');

// Multer storage configs
const multerStorage = multer.memoryStorage();

// Multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Configure multer with storage and filter
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware function for uploading a single photo
const userPhotoUpload = upload.single('photo');

module.exports = userPhotoUpload;
