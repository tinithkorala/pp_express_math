const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const LearningTypeQuestion = require('./LearningTypeQuestionModel');
const LearningTypeKey = require('./LearningTypeKeyModel');

const LearningTypeAnswer = sequelize.define(
  'learningTypeAnswer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    learning_type_key_id: {
      type: DataTypes.INTEGER,
      references: {
        model: LearningTypeKey,
        key: 'id',
      },
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = LearningTypeAnswer;
