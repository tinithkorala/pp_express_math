// Third-party imports
const express = require('express');

// Custom imports
const subTopicCategoryController = require('../controllers/subTopicCategoryController');
const protected = require('../middlewares/auth/protected');

const router = express.Router();

router.get('/', protected, subTopicCategoryController.getAllSubTopicCategories);

module.exports = router;
