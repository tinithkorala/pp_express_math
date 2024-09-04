const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const SubTopicCategory = require('./subTopicCategoryModel');

const SubTopic = sequelize.define(
  'subTopic',
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
      validate: {
        isAlpha: {
          msg: 'Please provide a valid name',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Please provide a slug',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Description can be up to 500 characters long',
        },
      },
    },
    main_photo: {
      type: DataTypes.STRING,
      defaultValue: 'default-sub-topics.jpg',
    },
    color: {
      type: DataTypes.STRING,
      default: '#003D78',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    sub_topic_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SubTopicCategory,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SubTopic;
