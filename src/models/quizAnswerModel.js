// src/models/quizAnswerModel.js
const db = require('../config/db');

const quizAnswerModel = {
  // Get all answers by question ID
  getAnswersByQuestionId: async (questionId) => {
    const [rows] = await db.query(
      'SELECT * FROM c_q_q_answers WHERE q_q_id = ?',
      [questionId]
    );
    return rows;
  },

  // Create a new answer
  createAnswer: async ({ q_q_id, answer }) => {
    if (!q_q_id || !answer) {
      throw new Error('Missing required fields');
    }

    const [result] = await db.query(
      'INSERT INTO c_q_q_answers (q_q_id, answer) VALUES (?, ?)',
      [q_q_id, answer]
    );
    return result;
  }
};

module.exports = quizAnswerModel;
