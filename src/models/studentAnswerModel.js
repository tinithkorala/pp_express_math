const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = require('./studentModel');
const QuizType = require('./quizTypeModel');

const StudentAnswer = sequelize.define(
  'studentAnswer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: 'id',
      },
    },
    quiz_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: QuizType,
        key: 'id',
      },
    },
    correct_total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    incorrect_total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = StudentAnswer;
