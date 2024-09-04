const crypto = require('crypto');

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const { sequelize } = require('../config/database');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Please provide a valid first name',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Please provide a valid last name',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Please provide a valid phone number',
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: 'default-profile.jpg',
    },
    role: {
      type: DataTypes.ENUM(
        'student',
        'teacher',
        'admin',
        'super-admin',
        'user'
      ),
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: 'Password must be at least 3 characters long',
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      validate: {
        matchesPassword(value) {
          if (value !== this.password) {
            throw new Error('Password confirmation does not match');
          }
        },
      },
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpiresIn: DataTypes.DATE,
    isPhotoUploaded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed('password')) {
          try {
            const saltRounds = parseInt(process.env.PASSWORD_SALT);
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
          } catch (error) {
            throw new Error('Error hashing password: ', +error.message);
          }
          user.passwordChangedAt = new Date();
        }
      },
    },
  }
);

// Prototype Methods
User.prototype.isCorrectPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log('hit');
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

User.prototype.createPasswordResetToken = function () {
  // Create reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Set reset token in db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiresIn =
    Date.now() + parseInt(process.env.PASSWORD_EXPIRES_MM) * 60 * 1000;
  return resetToken;
};

module.exports = User;
