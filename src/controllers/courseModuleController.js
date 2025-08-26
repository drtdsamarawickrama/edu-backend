const CourseModule = require('../models/courseModuleModel');

// Controller: Insert course module
const addCourseModule = async (req, res) => {
  try {
    const data = req.body;
    const result = await CourseModule.insertCourseModule(data);

    return res.status(201).json({
      message: 'Course module inserted successfully',
      moduleId: result.insertId,
    });
  } catch (err) {
    console.error('Insert error:', err);
    return res.status(500).json({ message: 'Failed to insert course module' });
  }
};

// Controller: View all course modules
const getAllCourseModules = async (req, res) => {
  try {
    const results = await CourseModule.getAllCourseModules();
    return res.status(200).json(results);
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ message: 'Failed to retrieve course modules' });
  }
};

module.exports = { addCourseModule, getAllCourseModules };
