const path = require('path');

// Third-party imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Custom imports
const baseRoutes = require('./routes/baseRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subTopicCategoryRoutes = require('./routes/subTopicCategoryRoutes');
const subTopicRoutes = require('./routes/subTopicRoutes');
const quizRoutes = require('./routes/quizRoutes');
const globalErrorHandler = require('./middlewares/errorHandlers/globalErrorHandler');

const User = require('./models/userModel');
const Student = require('./models/studentModel');
const SubTopicCategory = require('./models/subTopicCategoryModel');
const SubTopic = require('./models/subTopicModel');
const QuizLevel = require('./models/quizLevelModel');
const Question = require('./models/questionModel');
const Answer = require('./models/answerModel');
// const StudentAnswer = require('./models/studentAnswerModel');
// const StudentAnswerDetail = require('./models/studentAnswerDetailModel');
const QuizType = require('./models/quizTypeModel');
const LearningTypeKey = require('./models/LearningTypeKeyModel');
const LearningTypeQuestion = require('./models/LearningTypeQuestionModel');
const LearningTypeAnswer = require('./models/LearningTypeAnswerModel');
const LearningTypeStudentAnswer = require('./models/learningTypeStudentAnswerModel');
const LearningTypeStudentAnswerDetail = require('./models/learningTypeStudentAnswerDetailsModel');

// Express app
const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
};
app.use(cors(corsOptions));

// Cookies
app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/v1/base', baseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sub-topics', subTopicRoutes);
app.use('/api/v1/sub-topic-categories', subTopicCategoryRoutes);
app.use('/api/v1/quiz', quizRoutes);

// Associations
User.hasOne(Student, {
  foreignKey: 'user_id',
  as: 'student',
  onDelete: 'CASCADE',
});
Student.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

SubTopic.belongsTo(SubTopicCategory, {
  foreignKey: 'sub_topic_category_id',
  as: 'subTopicCategories',
});
SubTopicCategory.hasMany(SubTopic, {
  foreignKey: 'sub_topic_category_id',
  as: 'subTopics',
});

QuizLevel.hasMany(Question, {
  foreignKey: 'quiz_level_id',
  as: 'questions',
});
QuizType.hasMany(Question, {
  foreignKey: 'quiz_type_id',
  as: 'questions',
});
SubTopic.hasMany(Question, {
  foreignKey: 'sub_topic_id',
  as: 'questions',
});

Question.belongsTo(QuizLevel, {
  foreignKey: 'quiz_level_id',
  as: 'quizLevel',
});
Question.belongsTo(QuizType, {
  foreignKey: 'quiz_type_id',
  as: 'quizType',
});
Question.belongsTo(SubTopic, {
  foreignKey: 'sub_topic_id',
  as: 'subTopics',
});
Question.belongsTo(LearningTypeKey, {
  foreignKey: 'learning_type_key_id',
  as: 'learningTypeKey'
})
Question.hasMany(Answer, {
  foreignKey: 'question_id',
  as: 'answers',
});

Answer.belongsTo(Question, {
  foreignKey: 'question_id',
  as: 'question',
});

// Student.hasMany(StudentAnswer, {
//   foreignKey: 'student_id',
//   as: 'studentAnswers',
// });
// StudentAnswer.belongsTo(Student, {
//   foreignKey: 'student_id',
//   as: 'students',
// });
// StudentAnswer.hasMany(StudentAnswerDetail, {
//   foreignKey: 'student_answer_id',
//   as: 'student_answer_details',
// });

// StudentAnswerDetail.belongsTo(StudentAnswer, {
//   foreignKey: 'student_answer_id',
//   as: 'student_answer',
// });
// StudentAnswerDetail.belongsTo(Question, {
//   foreignKey: 'question_id',
//   as: 'question',
// });

// QuizType Associations
QuizType.hasMany(LearningTypeQuestion, {
  foreignKey: 'quiz_type_id',
  as: 'learningTypeQuestions',
});

// LearningTypeKey Associations
LearningTypeKey.hasMany(LearningTypeAnswer, {
  foreignKey: 'learning_type_key_id',
  as: 'learningTypeAnswers',
});
LearningTypeKey.hasMany(Question, {
  foreignKey: 'learning_type_key_id',
  as: 'questions'
});

// LearningTypeQuestion Associations
LearningTypeQuestion.belongsTo(QuizType, {
  foreignKey: 'quiz_type_id',
  as: 'quizType',
});
LearningTypeQuestion.hasMany(LearningTypeAnswer, {
  foreignKey: 'learning_type_question_id',
  as: 'learningTypeAnswers',
});

// LearningTypeAnswer Associations
LearningTypeAnswer.belongsTo(LearningTypeQuestion, {
  foreignKey: 'learning_type_question_id',
  as: 'learningTypeQuestion',
});
LearningTypeAnswer.belongsTo(LearningTypeKey, {
  foreignKey: 'learning_type_key_id',
  as: 'learningTypeKey',
});

// LearningTypeStudentAnswer Associations
LearningTypeStudentAnswer.hasMany(LearningTypeStudentAnswerDetail, {
  foreignKey: 'learning_type_student_answer_id',
  as: 'learningTypeStudentAnswerDetails',
});

LearningTypeStudentAnswer.belongsTo(QuizType, {
  foreignKey: 'quiz_type_id',
  as: 'quizType',
});

LearningTypeStudentAnswer.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'student',
});

// LearningTypeStudentAnswerDetail Associations
LearningTypeStudentAnswerDetail.belongsTo(LearningTypeStudentAnswer, {
  foreignKey: 'learning_type_student_answer_id',
  as: 'learningTypeStudentAnswer',
});

LearningTypeStudentAnswerDetail.belongsTo(LearningTypeQuestion, {
  foreignKey: 'learning_type_question_id',
  as: 'learningTypeQuestion',
});

LearningTypeStudentAnswerDetail.belongsTo(LearningTypeAnswer, {
  foreignKey: 'learning_type_answer_id',
  as: 'learningTypeAnswer',
});

app.use(globalErrorHandler);

module.exports = app;
