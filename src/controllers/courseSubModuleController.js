const courseSubModuleModel = require('../models/courseSubModuleModel');

// Add a new course sub-module
const addCourseSubModule = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields including unit
    if (
      !data.c_id ||
      !data.course_module_id ||
      typeof data.unit !== 'number' ||
      !data.title ||
      !data.description
    ) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const result = await courseSubModuleModel.insertCourseSubModule(data);
    res.status(201).json({ message: 'Course sub-module inserted successfully', insertId: result.insertId });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ message: 'Failed to insert course sub-module', error: err.message });
  }
};

// Get all or filtered course sub-modules
const getCourseSubModules = async (req, res) => {
  try {
    // Get optional query params
    const courseId = req.query.courseId ? parseInt(req.query.courseId, 10) : null;
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId, 10) : null;

    // Validate if provided
    if ((courseId && isNaN(courseId)) || (moduleId && isNaN(moduleId))) {
      return res.status(400).json({ message: 'courseId and moduleId must be numbers' });
    }

    const results = await courseSubModuleModel.getCourseSubModules(courseId, moduleId);
    res.status(200).json(results);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to retrieve course sub-modules', error: err.message });
  }
};

module.exports = { addCourseSubModule, getCourseSubModules };
