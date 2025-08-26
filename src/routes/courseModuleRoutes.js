const express = require('express');
const router = express.Router();
const {
  addCourseModule,
  getAllCourseModules,
} = require('../controllers/courseModuleController');

// POST /api/course-modules
router.post('/', addCourseModule);

// GET /api/course-modules
router.get('/', getAllCourseModules);

module.exports = router;
