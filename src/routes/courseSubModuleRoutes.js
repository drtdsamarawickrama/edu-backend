const express = require('express');
const router = express.Router();
const {
  addCourseSubModule,
  getCourseSubModules,
} = require('../controllers/courseSubModuleController');

// POST /api/course-sub-modules
router.post('/', addCourseSubModule);

// GET /api/course-sub-modules?courseId=1&moduleId=2
router.get('/', getCourseSubModules);

module.exports = router;
