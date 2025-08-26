// src/controllers/quizAnswerController.js
const quizAnswerModel = require('../models/quizAnswerModel');

// GET /api/quiz-answers?q_q_id=1
exports.getAnswers = async (req, res) => {
  const { q_q_id } = req.query;

  if (!q_q_id) {
    return res.status(400).json({ message: 'Missing question ID (q_q_id)' });
  }

  try {
    const answers = await quizAnswerModel.getAnswersByQuestionId(q_q_id);
    return res.status(200).json(answers);
  } catch (error) {
    console.error('❌ Error fetching answers:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// POST /api/quiz-answers
exports.createAnswer = async (req, res) => {
  const { q_q_id, answer } = req.body;

  if (!q_q_id || !answer) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await quizAnswerModel.createAnswer({ q_q_id, answer });
    return res.status(201).json({
      message: 'Answer created',
      answerId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating answer:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
};
