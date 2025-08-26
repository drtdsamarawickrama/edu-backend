// src/models/courseModel.js
const db = require('../config/db');

// Insert a course (title + lang)
const insertCourse = async ({ title, lang }) => {
  try {
    const sql = `INSERT INTO course (title, lang) VALUES (?, ?)`;
    const [result] = await db.query(sql, [title, lang]);
    return result;
  } catch (error) {
    console.error('DB insertCourse error:', error.message || error);
    throw error;
  }
};

// Get only id and title
const getAllCourses = async () => {
  try {
    const [results] = await db.query('SELECT id, title FROM course');
    return results;
  } catch (error) {
    console.error('DB getAllCourses error:', error.message || error);
    throw error;
  }
};

module.exports = { insertCourse, getAllCourses };
