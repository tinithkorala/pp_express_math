const asyncErrorCatchHandler = require('../middlewares/errorHandlers/asyncErrorCatchHandler');
const QuizLevel = require('../models/quizLevelModel');
const SubTopic = require('../models/subTopicModel');
const Question = require('../models/questionModel');
const QuizType = require('../models/quizTypeModel');
const Answer = require('../models/answerModel');
const { getStudentId } = require('../utils/student_helper');
const AppError = require('../services/errorService');
const { getQuizId, checkStudentAnswer } = require('../utils/quiz_helper');
const StudentAnswer = require('../models/studentAnswerModel');
const StudentAnswerDetail = require('../models/studentAnswerDetailModel');
const { sequelize } = require('../config/database');
const Student = require('../models/studentModel');
const LearningTypeQuestion = require('../models/LearningTypeQuestionModel');
const { model } = require('mongoose');
const LearningTypeAnswer = require('../models/LearningTypeAnswerModel');
const LearningTypeStudentAnswer = require('../models/learningTypeStudentAnswerModel');
const LearningTypeStudentAnswerDetail = require('../models/learningTypeStudentAnswerDetailsModel');

exports.getPlacement = asyncErrorCatchHandler(async (req, res) => {
  const placementQuestions = await Question.findAll({
    include: [
      {
        model: QuizType,
        as: 'quizType',
        attributes: ['name'],
        where: {
          name: 'placement',
        },
      },
      {
        model: QuizLevel,
        as: 'quizLevel',
        attributes: ['name'],
      },
      {
        model: Answer,
        as: 'answers',
        attributes: ['id', 'question_id', 'answer'],
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: placementQuestions.length,
    data: {
      data: placementQuestions,
    },
  });
});

exports.storePlacementAnswers = asyncErrorCatchHandler(
  async (req, res, next) => {
    const QUIZTYPE = 'placement';
    const { answers } = req.body;

    const transaction = await sequelize.transaction();

    try {
      // Create StudentAnswer Obj
      const studentResponse = await getStudentId(req.user.id);

      if (studentResponse.status === false) {
        return next(new AppError(studentResponse.errorMessage, 404));
      }

      const quizResponse = await getQuizId(QUIZTYPE);

      if (quizResponse.status === false) {
        return next(new AppError(quizResponse.errorMessage, 404));
      }

      const studentAnswerData = {
        student_id: studentResponse.id,
        quiz_type_id: quizResponse.id,
      };

      // Save StudentAnswer
      const studentAnswerResponse = await StudentAnswer.create(
        studentAnswerData,
        { transaction }
      );

      if (!studentAnswerResponse) {
        return next(new AppError('There is error please try again later', 400));
      }

      const answerPromises = Object.keys(answers).map(async (questionId) => {
        console.log(
          `Question id: ${questionId} and answer is: ${answers[questionId]}`
        );

        const answer = answers[questionId];

        // Validate answers
        if (!answer) {
          throw new AppError('Invalid answer provided', 400);
        }

        const checkStudentAnswerResponse = await checkStudentAnswer(
          answer,
          questionId
        );

        if (!checkStudentAnswerResponse.status) {
          throw new AppError(checkStudentAnswerResponse.errorMessage, 400);
        }

        const studentAnswerDetailsData = {
          student_answer_id: studentAnswerResponse.id,
          question_id: questionId,
          student_checked_answer_id: answer,
          answer_status: checkStudentAnswerResponse.answerStatus,
        };

        await StudentAnswerDetail.create(studentAnswerDetailsData, {
          transaction,
        });
      });

      await Promise.all(answerPromises);

      // Update student
      const studentUpdateRes = await Student.update(
        { placement_status: true },
        { where: { id: studentResponse.id }, transaction }
      );

      await transaction.commit();

      // Get student
      const studentRes = await Student.findByPk(studentResponse.id);

      res.status(201).json({
        status: 'success',
        message: 'Answers stored successfully',
        data: {
          data: studentRes,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
);

exports.getLearningTypeQuiz = asyncErrorCatchHandler(async (req, res) => {
  const learningTypeQuiz = await LearningTypeQuestion.findAll({
    include: [
      {
        model: QuizType,
        as: 'quizType',
        attributes: ['id', 'name'],
      },
      {
        model: LearningTypeAnswer,
        as: 'learningTypeAnswers',
        attributes: ['id', 'learning_type_question_id', 'answer'],
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: learningTypeQuiz.length,
    data: {
      data: learningTypeQuiz,
    },
  });
});

exports.storeLearningTypeAnswers = asyncErrorCatchHandler(async (req, res) => {
  const { answers } = req.body;
  const QUIZTYPE = 'learning-type';

  const transaction = await sequelize.transaction();

  try {
    // Create StudentAnswer Obj
    const studentResponse = await getStudentId(req.user.id);
    if (studentResponse.status === false) {
      return next(new AppError(studentResponse.errorMessage, 404));
    }

    const quizResponse = await getQuizId(QUIZTYPE);

    if (quizResponse.status === false) {
      return next(new AppError(quizResponse.errorMessage, 404));
    }

    const studentAnswerData = {
      student_id: studentResponse.id,
      quiz_type_id: quizResponse.id,
    };

    // Save StudentAnswer
    const learningTypeStudentAnswerResponse =
      await LearningTypeStudentAnswer.create(studentAnswerData, {
        transaction,
      });

    if (!learningTypeStudentAnswerResponse) {
      return next(new AppError('There is error please try again later', 400));
    }

    const answerPromises = Object.keys(answers).map(async (questionId) => {
      console.log(
        `Question id: ${questionId} and answer is: ${answers[questionId]}`
      );

      const answer = answers[questionId];

      // Validate answers
      if (!answer) {
        throw new AppError('Invalid answer provided', 400);
      }

      // Check answer in valid in db
      const learningTypeAnswerValidate = LearningTypeAnswer.findByPk(answer);
      if (!learningTypeAnswerValidate) {
        throw new AppError('Invalid answer provided', 400);
      }

      const studentAnswerDetailsData = {
        learning_type_student_answer_id: learningTypeStudentAnswerResponse.id,
        learning_type_question_id: questionId,
        learning_type_answer_id: learningTypeAnswerValidate.id,
      };

      await LearningTypeStudentAnswerDetail.create(studentAnswerDetailsData, {
        transaction,
      });
    });

    await Promise.all(answerPromises);

    // Update student
    const studentUpdateRes = await Student.update(
      { learning_type_status: true },
      { where: { id: studentResponse.id }, transaction }
    );

    await transaction.commit();

    // Get student
    const studentRes = await Student.findByPk(studentResponse.id);

    res.status(200).json({
      status: 'success',
      data: {
        data: studentRes,
      },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
