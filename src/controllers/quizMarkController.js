const QuizMarkModel = require('../models/quizMarkModel');

exports.storeMark = async (req, res) => {
  try {
    const { m_id, c_q_id, c_q_question_id, c_q_q_answers_id, marks } = req.body;

    if (!m_id || !c_q_id || !c_q_question_id || !c_q_q_answers_id || marks == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await QuizMarkModel.storeMark({ m_id, c_q_id, c_q_question_id, c_q_q_answers_id, marks });

    res.status(201).json({
      message: 'Mark stored successfully',
      insertId: result.insertId,
    });
  } catch (error) {
    console.error('Error storing mark:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all attempts (flat list) for frontend display
exports.getAttempts = async (req, res) => {
  try {
    const { m_id } = req.query;
    if (!m_id) return res.status(400).json({ message: 'Member ID required' });

    const attempts = await QuizMarkModel.getAllAttempts(m_id);
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily median progress for chart
exports.getProgress = async (req, res) => {
  try {
    const { m_id } = req.query;
    if (!m_id) return res.status(400).json({ message: 'Member ID required' });

    const progress = await QuizMarkModel.getProgressByDate(m_id);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
