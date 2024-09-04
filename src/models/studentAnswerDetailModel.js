const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const StudentAnswer = require('./studentAnswerModel');
const Question = require('./questionModel');
const Answer = require('./answerModel');

const StudentAnswerDetail = sequelize.define(
  'studentAnswerDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    student_answer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: StudentAnswer,
        key: 'id',
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Question,
        key: 'id',
      },
    },
    student_checked_answer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: Answer,
        key: 'id',
      },
    },
    answer_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = StudentAnswerDetail;
