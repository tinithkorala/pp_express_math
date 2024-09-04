const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizType = require('./quizTypeModel');

const LearningTypeQuestion = sequelize.define(
  'learningTypeQuestion',
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
    question_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = LearningTypeQuestion;
