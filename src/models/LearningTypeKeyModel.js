const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LearningTypeKey = sequelize.define(
  'learningTypeKey',
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = LearningTypeKey;