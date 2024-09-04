const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizType = require('./quizTypeModel');
const LearningTypeKey = require('./LearningTypeKeyModel');

const Question = sequelize.define(
  'question',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sub_topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subTopics',
        key: 'id',
      },
    },
    quiz_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quizLevels',
        key: 'id',
      },
    },
    quiz_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: QuizType,
        key: 'id',
      },
    },
    learning_type_key_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LearningTypeKey,
        key: 'id'
      }
    },
    question_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Question;
