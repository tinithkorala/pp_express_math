const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizLevel = sequelize.define(
  'quizLevel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Please provide a valid name',
        },
      },
    },
    mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = QuizLevel;
