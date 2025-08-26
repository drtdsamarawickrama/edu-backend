// src/routes/quizQuestionRoutes.js
const express = require('express');
const router = express.Router();
const quizQuestionController = require('../controllers/quizQuestionController');

// GET all questions for a quiz
router.get('/', quizQuestionController.getQuestions);

// POST a new question
router.post('/', quizQuestionController.createQuestion);

module.exports = router;
