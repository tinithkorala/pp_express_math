const sharp = require('sharp');
const asyncErrorCatchHandler = require('../errorHandlers/asyncErrorCatchHandler');

const resizeUserPhoto = asyncErrorCatchHandler(async (req, res, next) => {
  // Skip this if there is no file
  if (!req.file) next();

  // Create file name
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

  // Resize using sharp
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

module.exports = resizeUserPhoto;
