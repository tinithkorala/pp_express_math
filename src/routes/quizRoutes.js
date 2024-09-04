const express = require('express');
const quizController = require('../controllers/quizController');
const protected = require('./../middlewares/auth/protected');

const router = express.Router();

router.use(protected);

router.get('/placement', quizController.getPlacement);
router.post('/placement', quizController.storePlacementAnswers);

router.get('/learning-types', quizController.getLearningTypeQuiz);
router.post('/learning-types', quizController.storeLearningTypeAnswers);

module.exports = router;
