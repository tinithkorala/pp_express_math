const asyncErrorCatchHandler = require('../middlewares/errorHandlers/asyncErrorCatchHandler');
const SubTopic = require('../models/subTopicModel');

exports.getAllSubTopics = asyncErrorCatchHandler(async (req, res, next) => {
  const subTopics = await SubTopic.findAll();
  res.status(200).json({
    status: 'success',
    results: subTopics.length,
    data: {
      data: subTopics,
    },
  });
});
