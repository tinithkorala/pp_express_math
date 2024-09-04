// Third-party imports
const express = require('express');

// Custom imports
const subTopicController = require('../controllers/subTopicController');
const protected = require('../middlewares/auth/protected');

const router = express.Router();

router.get('/', protected, subTopicController.getAllSubTopics);

module.exports = router;
