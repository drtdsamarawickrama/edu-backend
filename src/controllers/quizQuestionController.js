// src/controllers/quizQuestionController.js
const quizQuestionModel = require('../models/quizQuestionModel');
const quizAnswerModel = require('../models/quizAnswerModel');

// GET /api/quiz-questions?q_id=1
exports.getQuestions = async (req, res) => {
  const { q_id } = req.query;

  if (!q_id) {
    return res.status(400).json({ message: 'Missing quiz ID (q_id)' });
  }

  try {
    const questions = await quizQuestionModel.getQuestionsByQuizId(q_id);

    const updatedQuestions = await Promise.all(
      questions.map(async (q) => {
        try {
          const answers = await quizAnswerModel.getAnswersByQuestionId(q.id);
          return { ...q, answers };
        } catch (error) {
          console.error(`❌ Error fetching answers for question ${q.id}:`, error);
          return { ...q, answers: [] };
        }
      })
    );

    res.status(200).json(updatedQuestions);
  } catch (err) {
    console.error('❌ Error fetching questions:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// POST /api/quiz-questions
exports.createQuestion = async (req, res) => {
  const { q_id, question, answer_id } = req.body;

  if (!q_id || !question || answer_id === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await quizQuestionModel.createQuestion({ q_id, question, answer_id });
    res.status(201).json({
      message: 'Question created successfully',
      questionId: result.insertId
    });
  } catch (err) {
    console.error('❌ Error creating question:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
