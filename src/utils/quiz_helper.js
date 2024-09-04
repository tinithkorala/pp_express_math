const Answer = require('../models/answerModel');
const QuizType = require('../models/quizTypeModel');

const getQuizId = async (searchText) => {
  let response = {
    status: false,
    id: null,
    errorMessage: null,
  };
  try {
    const quizId = await QuizType.findOne({ where: { name: searchText } });
    if (quizId) {
      response.status = true;
      response.id = quizId.id;
    } else {
      response.errorMessage = 'Quiz not found';
    }
  } catch (error) {
    response.errorMessage = 'An error occurred while retrieving Quiz ID';
    console.error('Error in getQuizId:', error);
  }
  return response;
};

const checkStudentAnswer = async (answerId, questionId) => {
  let response = {
    status: false,
    answerStatus: false,
    errorMessage: null,
  };
  try {
    const answerResponse = await Answer.findOne({
      where: { id: answerId, question_id: questionId },
    });
    console.log(`QuestionId : ${questionId} ----- AnswerId : ${answerId} ----- IsCorrect: ${answerResponse.isCorrect}`);
    if (answerResponse) {
      response.status = true;
      response.answerStatus = answerResponse.isCorrect;
    }else {
      response.errorMessage = 'An error occurred answer';
    }
  } catch (error) {
    response.errorMessage = 'An error occurred while checking answer';
    console.error('Error in checkStudentAnswer:', error);
  }
  return response;
};

module.exports = {
  getQuizId,
  checkStudentAnswer,
};
