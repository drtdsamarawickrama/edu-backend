// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { addCourse, getAllCourses } = require('../controllers/courseController');

// POST /api/courses
router.post('/', addCourse);

// GET /api/courses
router.get('/', getAllCourses);

module.exports = router;
