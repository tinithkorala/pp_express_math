const Student = require('../models/studentModel');

const getStudentId = async (userId) => {
  let response = {
    status: false,
    id: null,
    errorMessage: null,
  };
  try {
    const studentId = await Student.findOne({ where: { user_id: userId } });
    if (studentId) {
      response.status = true;
      response.id = studentId.id;
    } else {
      response.errorMessage = 'Student not found';
    }
  } catch (error) {
    response.errorMessage = 'An error occurred while retrieving student ID';
    console.error('Error in getStudentId:', error);
  }
  return response;
};

module.exports = {
  getStudentId,
};
