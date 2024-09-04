const asyncErrorCatchHandler = require('../middlewares/errorHandlers/asyncErrorCatchHandler');
const SubTopicCategory = require('../models/subTopicCategoryModel');

exports.getAllSubTopicCategories = asyncErrorCatchHandler(
  async (req, res, next) => {
    const subTopicCategories = await SubTopicCategory.findAll();
    res.status(200).json({
      status: 'success',
      results: subTopicCategories.length,
      data: {
        data: subTopicCategories,
      },
    });
  }
);
