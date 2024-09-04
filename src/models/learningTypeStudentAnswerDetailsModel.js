const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const LearningTypeStudentAnswer = require('./learningTypeStudentAnswerModel');
const LearningTypeQuestion = require('./LearningTypeQuestionModel');
const LearningTypeAnswer = require('./LearningTypeAnswerModel');

const LearningTypeStudentAnswerDetail = sequelize.define(
  'learningTypeStudentAnswerDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    learning_type_student_answer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: LearningTypeStudentAnswer,
        key: 'id',
      },
      allowNull: false,
    },
    learning_type_question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: LearningTypeQuestion,
        key: 'id',
      },
      allowNull: false,
    },
    learning_type_answer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: LearningTypeAnswer,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

module.exports = LearningTypeStudentAnswerDetail;
