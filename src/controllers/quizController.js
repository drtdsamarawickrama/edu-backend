const Quiz = require('../models/quizModel');

// ✅ GET /api/quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const { c_id, course_module_id, lang } = req.query;
    console.log('📥 GET /api/quizzes', req.query);

    const results = await Quiz.getFiltered(c_id, course_module_id, lang);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error fetching quizzes:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// ✅ POST /api/quizzes
const createQuiz = async (req, res) => {
  try {
    const {
      c_id,
      course_module_id,
      title,
      description,
      lang_en,
      lang_si,
      lang_ta
    } = req.body;

    console.log('📥 POST /api/quizzes', req.body);

    if (!c_id || !course_module_id || !title) {
      return res.status(400).json({
        error: 'c_id, course_module_id, and title are required'
      });
    }

    const newQuiz = {
      c_id,
      course_module_id,
      title,
      description: description || '',
      lang_en: lang_en || 0,
      lang_si: lang_si || 0,
      lang_ta: lang_ta || 0
    };

    const result = await Quiz.create(newQuiz);
    res.status(201).json({
      message: 'Quiz created successfully',
      quizId: result.insertId
    });
  } catch (err) {
    console.error('❌ Error creating quiz:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getAllQuizzes,
  createQuiz
};
