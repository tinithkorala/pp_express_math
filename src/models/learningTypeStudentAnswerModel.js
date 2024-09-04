const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizType = require('./quizTypeModel');
const Student = require('./studentModel');

const LearningTypeStudentAnswer = sequelize.define(
  'learningTypeStudentAnswer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quiz_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: QuizType,
        key: 'id',
      },
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: 'id'
      },
      allowNull: false
    }
  },
  { timestamps: true }
);

module.exports = LearningTypeStudentAnswer;
