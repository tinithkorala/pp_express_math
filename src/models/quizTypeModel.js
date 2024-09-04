const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizType = sequelize.define(
  'quizType',
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
    },
  },
  { timestamps: true }
);

module.exports = QuizType;