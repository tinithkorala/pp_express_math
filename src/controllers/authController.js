const crypto = require('crypto');

const { Op } = require('sequelize');

const { aRoles } = require('../constants/app.config');
const asyncErrorCatchHandler = require('../middlewares/errorHandlers/asyncErrorCatchHandler');
const User = require('../models/userModel');
const AppError = require('../services/errorService');
const { createSendToken } = require('../services/tokenService');
const Email = require('../services/emailService');
const Student = require('../models/studentModel');

exports.signUp = asyncErrorCatchHandler(async (req, res, next) => {
  // Create user
  const newUser = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${process.env.CLIENT_URL}/dashboard`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.signIn = asyncErrorCatchHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check email password exist
  if (!email || !password) {
    return next(
      new AppError('Handle this error 400 : Email or password needed', 400)
    );
  }

  // Check if user exist && password is correct
  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.setRole = asyncErrorCatchHandler(async (req, res, next) => {
  const { role } = req.body;

  // Check is role empty
  if (!role) {
    return next(new AppError('Role is a required', 400));
  }

  // Check role is valid
  const roles = aRoles;
  if (!roles.includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  // Check is role contains admin roles
  if (role === 'admin' || role === 'super admin') {
    return next(new AppError('This route not set roles for admins', 401));
  }

  // Check if the current user's role is 'user'
  if (req.user.role != 'user') {
    return next(
      new AppError(
        "Cannot change the user's role, Please contact the administrator",
        401
      )
    );
  }

  // Create user details account based on role
  let userDetials = null;
  if (role === roles[0]) {
    userDetials = await Student.create({
      user_id: req.user.id,
      placement_status: false,
    });
  }

  // Update the user's role
  const user = await User.findByPk(req.user.id);
  user.role = role;
  await user.save({
    validate: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      userId: user.id,
      role: user.role,
      userDetials: userDetials,
    },
  });
});

exports.verify = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      userId: req.user.id,
      auth: true,
    },
  });
};

exports.forgotPassword = asyncErrorCatchHandler(async (req, res, next) => {
  // Get user by email
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return next(
      new AppError('Password reset email sent. Please check your inbox.', 400)
    );
  }

  // Create token and passwordExpiresAt
  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false });

  // Send password reset email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send password reset email
  try {
    await new Email(user, resetUrl).sendPasswordReset();
    return res.status(200).json({
      status: 'success',
      message: 'Password reset email sent. Please check your mail inbox',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validate: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        400
      )
    );
  }
});

exports.resetPassword = asyncErrorCatchHandler(async (req, res, next) => {
  // Get user by the resetToken
  const resetToken = req.params.token;

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpiresIn: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update user password
  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpiresIn = null;
  await user.save();

  // TODO :: Send email
  // Send password reset success email

  // Logged in user
  createSendToken(user, 201, res);
});

exports.logout = asyncErrorCatchHandler(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.clearCookie('jwt', cookieOptions);
  res.status(200).json({
    status: 'success',
    message: 'You have been successfully logged out.',
  });
});
