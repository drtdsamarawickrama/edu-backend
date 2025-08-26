// src/models/quizQuestionModel.js
const db = require('../config/db');

const quizQuestionModel = {
  // Get all questions for a quiz
  async getQuestionsByQuizId(q_id) {
    const [rows] = await db.query('SELECT * FROM c_q_question WHERE q_id = ?', [q_id]);
    return rows;
  },

  // Create a new question
  async createQuestion({ q_id, question, answer_id }) {
    const [result] = await db.query(
      'INSERT INTO c_q_question (q_id, question, answer_id) VALUES (?, ?, ?)',
      [q_id, question, answer_id]
    );
    return result;
  },

  // Optional: Delete a question
  async deleteQuestion(id) {
    const [result] = await db.query('DELETE FROM c_q_question WHERE id = ?', [id]);
    return result;
  },

  // Optional: Update a question
  async updateQuestion(id, question, answer_id) {
    const [result] = await db.query(
      'UPDATE c_q_question SET question = ?, answer_id = ? WHERE id = ?',
      [question, answer_id, id]
    );
    return result;
  }
};

module.exports = quizQuestionModel;
