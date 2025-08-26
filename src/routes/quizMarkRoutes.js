const express = require('express');
const router = express.Router();
const quizMarkController = require('../controllers/quizMarkController');

router.post('/', quizMarkController.storeMark);
router.get('/attempts', quizMarkController.getAttempts);
router.get('/progress', quizMarkController.getProgress);

module.exports = router;
