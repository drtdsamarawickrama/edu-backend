// src/routes/quizAnswerRoutes.js
const express = require('express');
const router = express.Router();
const quizAnswerController = require('../controllers/quizAnswerController');

// GET all answers for a question
router.get('/', quizAnswerController.getAnswers);

// POST a new answer
router.post('/', quizAnswerController.createAnswer);

module.exports = router;
