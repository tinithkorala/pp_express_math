const Answer = require('../models/answerModel');
const LearningTypeAnswer = require('../models/LearningTypeAnswerModel');
const LearningTypeKey = require('../models/LearningTypeKeyModel');
const LearningTypeQuestion = require('../models/LearningTypeQuestionModel');
const Question = require('../models/questionModel');
const QuizLevel = require('../models/quizLevelModel');
const QuizType = require('../models/quizTypeModel');
const Student = require('../models/studentModel');
const SubTopicCategory = require('../models/subTopicCategoryModel');
const SubTopic = require('../models/subTopicModel');
const User = require('../models/userModel');
const SheetDataRead = require('../services/sheetDataReadService');

const readSheetData = (sheetName) => {
  let data = [];
  try {
    data = new SheetDataRead(sheetName).readData();
    return data;
  } catch (error) {
    console.error('Error : ', error.message);
  }
};

const seedData = async (parentModel, parentData, childModel = null) => {
  try {
    // Get table name
    const tableName = parentModel.getTableName
      ? parentModel.getTableName()
      : parentModel.tableName;

    // Check row count
    const count = await parentModel.count();
    if (count > 0) {
      console.log(`${tableName} is not empty. Skipping data insertion.`);
      return false;
    }
    if (childModel) {
      for (data of parentData) {
        let { insertDataChild, correct_answer, ...rest } = data;
        const parentRes = await parentModel.create(rest);
        if (parentRes) {
          for (el of insertDataChild) {
            childModel.create({
              question_id: parentRes.id,
              answer: el,
              isCorrect: el == correct_answer,
            });
          }
        }
      }
    }
    if (!childModel) {
      await parentModel.bulkCreate(parentData);
    }
    return true;
  } catch (error) {
    console.error('Error : ', error.message);
    console.error('Error : ', error.stack);
  }
};

const getIdForMatchingRecord = async (model, searchField, searchText) => {
  const response = {
    status: false,
    id: null,
  };
  try {
    const result = await model.findOne({
      where: { [searchField]: searchText },
    });
    response.status = true;
    response.id = result ? result.id : null;
  } catch (error) {
    console.error('Error : ', error.message);
  }
  return response;
};

const seedSubCategories = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('SubTopicCategories.xlsx');
    const insertData = [];
    for (record of data) {
      insertData.push({
        name: record['name'],
        slug: record['slug'],
      });
    }
    await seedData(SubTopicCategory, insertData);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedSubTopics = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('SubTopics.xlsx');
    const insertData = [];
    for (record of data) {
      const SubTopicCategoryResult = await getIdForMatchingRecord(
        SubTopicCategory,
        'name',
        record['subtopic']
      );
      if (SubTopicCategoryResult.status) {
        insertData.push({
          name: record['name'],
          slug: record['slug'],
          description: record['description'],
          color: record['color'],
          sub_topic_category_id: SubTopicCategoryResult.id,
        });
      }
    }
    await seedData(SubTopic, insertData);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedQuizLevel = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('QuizLevel.xlsx');
    const insertData = [];
    for (record of data) {
      insertData.push({
        name: record['name'],
        mark: record['mark'],
      });
    }
    await seedData(QuizLevel, insertData);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedQuizType = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('QuizType.xlsx');
    const insertData = [];
    for (record of data) {
      insertData.push({
        name: record['name'],
      });
    }
    await seedData(QuizType, insertData);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedQuestions = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('Questions.xlsx');
    const insertDataParent = [];
    for (record of data) {
      const SubTopicResult = await getIdForMatchingRecord(
        SubTopic,
        'name',
        record['subTopic']
      );
      const QuizLevelResult = await getIdForMatchingRecord(
        QuizLevel,
        'name',
        record['quizLevel']
      );
      const QuizTypeResult = await getIdForMatchingRecord(
        QuizType,
        'name',
        record['quizType']
      );
      if (
        SubTopicResult.status &&
        SubTopicResult.status &&
        QuizTypeResult.status
      ) {
        insertDataParent.push({
          sub_topic_id: SubTopicResult.id,
          quiz_level_id: QuizLevelResult.id,
          quiz_type_id: QuizTypeResult.id,
          question_description: record['question_description'],
          insertDataChild: [
            record['a1'],
            record['a2'],
            record['a3'],
            record['a4'],
          ],
          correct_answer: record['correct_answer'],
        });
      }
    }
    await seedData(Question, insertDataParent, Answer);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedLearningTypeKeys = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('LearningTypeKeys.xlsx');
    const insertData = [];
    for (record of data) {
      insertData.push({
        name: record['name'],
        slug: record['slug'],
      });
    }
    await seedData(LearningTypeKey, insertData);
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedLearningTypeQuestionsAnswers = async () => {
  const response = {
    status: 'false',
  };
  try {
    const data = readSheetData('LearningTypeQuestions.xlsx');
    const insertDataParent = [];
    const count = await LearningTypeQuestion.count();
    if (count > 0) {
      console.log(
        `learningTypeQuestion is not empty. Skipping data insertion.`
      );
      return response;
    }
    for (record of data) {
      const QuizTypeResult = await getIdForMatchingRecord(
        QuizType,
        'name',
        record['quizType']
      );

      if (QuizTypeResult.status) {
        const LearningTypeQuestionRes = await LearningTypeQuestion.create({
          quiz_type_id: QuizTypeResult.id,
          question_description: record['question_description'],
        });
        if (LearningTypeQuestionRes) {
          let childData = [];
          for (let index = 1; index < 3; index++) {
            const KeyResult = await getIdForMatchingRecord(
              LearningTypeKey,
              'name',
              record[`key${index}`]
            );
            childData.push({
              learning_type_question_id: LearningTypeQuestionRes.id,
              answer: record[`a${index}`],
              learning_type_key_id: KeyResult.id,
            });
          }
          console.log(childData);
          await LearningTypeAnswer.bulkCreate(childData);
        }
      }
    }
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
  }
  return response;
};

const seedUsers = async () => {
  const data = [
    {
      first_name: 'student',
      last_name: 'math',
      email: 'student_math@online.com',
      phone: '0123456789',
      role: 'student',
      password: 'Pass@1234',
    },
    {
      first_name: 'teacher',
      last_name: 'math',
      email: 'teacher_math@online.com',
      phone: '0123456789',
      role: 'teacher',
      password: 'Pass@1234',
    },
  ];
  const response = {
    status: 'false',
  };
  try {
    const count = await User.count();
    if (count === 0) {
      // Create users
      for (user of data) {
        const resUser = await User.create({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          password: user.password,
        });
        if (user.role === 'student') {
          const updateUser = await User.update(
            { role: 'student' },
            { where: { id: resUser.id } }
          );
          const resStudent = await Student.create({
            user_id: resUser.id,
          });
        } else if (user.role === 'teacher') {
          const updateUser = await User.update(
            { role: 'teacher' },
            { where: { id: resUser.id } }
          );
        }
      }
    }
  } catch (error) {
    response.status = false;
    console.error('Error : ', error.message);
    console.error('Error : ', error.stack);
  }
  return response;
};

const migrate = async () => {
  // const resSeedSubCategories = await seedSubCategories();
  // if (resSeedSubCategories.status) {
  //   const resSeedSubTopics = await seedSubTopics();
  //   if (resSeedSubTopics.status) {
  //     const resSeedQuizLevel = await seedQuizLevel();
  //     const resSeedQuizType = await seedQuizType();
  //     if (resSeedQuizLevel.status && resSeedQuizType.status) {
  //       const resSeedQuestions = await seedQuestions();
  //       const resSeedLearningTypeKeys = await seedLearningTypeKeys();
  //       if (resSeedLearningTypeKeys.status) {
  //         const resSeedLearningTypeQuestionsAnswers =
  //           await seedLearningTypeQuestionsAnswers();
  //         const resSeedUsers = seedUsers();
  //       }
  //     }
  //   }
  // }
};

module.exports = migrate;
