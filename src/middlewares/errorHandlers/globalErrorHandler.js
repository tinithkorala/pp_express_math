const AppError = require('../../services/errorService');

// Error create functions
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError('Invalid token. Please log in again', 401);
};

// Send development error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send production error
const sendErrorProd = (err, res) => {
  // Operational > trusted errors we create in application
  if (err?.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// Global error handling middleware
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Send error response client-side based on production/development
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let processedError = error;

    console.log('💥💥💥💥💥💥💥💥💥💥💥💥💥 Error', error);
    // console.log(error);

    // Handle Sequelize validation error
    if (error.name === 'SequelizeValidationError') {
      processedError = handleValidationErrorDB(error);
    }

    // Handle duplicate errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      processedError = handleDuplicateFieldsDB(error);
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      errorResponse = handleCastErrorDB(error);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      processedError = handleValidationErrorDB(error);
    }

    // Handle jwt errors
    if (error.name === 'JsonWebTokenError') {
      processedError = handleJWTError(error);
    }

    sendErrorProd(processedError, res);
  }
};
