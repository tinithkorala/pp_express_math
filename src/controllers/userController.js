const asyncErrorCatchHandler = require('../middlewares/errorHandlers/asyncErrorCatchHandler');
const User = require('../models/userModel');
const AppError = require('../services/errorService');
const { filterObj } = require('../utils/data_helper');

exports.update = asyncErrorCatchHandler(async (req, res, next) => {
  console.log('Body : ', req.body);
  console.log('Files : ', req.file);

  // Create error for password changes
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'first_name', 'last_name', 'email');
  if (req.file) filteredBody.photo = req.filename = req.file.filename;
  if (req.file) filteredBody.isPhotoUploaded = true;

  const [rowsUpdated] = await User.update(filteredBody, {
    where: { id: req.user.id },
  });

  if (rowsUpdated > 0) {
    const updatedUser = await User.findByPk(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          photo: `${process.env.SERVER_URL}/img/users/${updatedUser.photo}`,
          role: updatedUser.role,
          isPhotoUploaded: updatedUser.isPhotoUploaded,
        },
      },
    });
  } else {
    new AppError('User not update correctly', 400);
  }
});
