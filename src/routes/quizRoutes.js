const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// GET /api/quizzes?c_id=&course_module_id=&lang=
router.get('/', quizController.getAllQuizzes);

// POST /api/quizzes
router.post('/', quizController.createQuiz);

module.exports = router;
