const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./../config/database');

const SubTopicCategory = sequelize.define(
  'subTopicCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,  // Ensure name cannot be null
      validate: {
        isAlpha: {
          msg: 'Please provide a valid name',
        },
      },
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,  
      validate: {
        notEmpty: {
          msg: 'Please provide a slug',
        },
      },
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#FF0000', 
    },
  },
  { timestamps: true }
);

module.exports = SubTopicCategory;
