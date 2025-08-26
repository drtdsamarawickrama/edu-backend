const db = require('../config/db');

// Insert course sub-module (with unit)
const insertCourseSubModule = async (data) => {
  const sql = `INSERT INTO course_sub_module 
    (c_id, course_module_id, unit, title, description, youtube_link) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    data.c_id,
    data.course_module_id,
    data.unit,           // Include unit here
    data.title,
    data.description,
    data.youtube_link,
  ];

  const [result] = await db.query(sql, values);
  return result;
};

// Get all course sub-modules, optionally filtered by course and module
const getCourseSubModules = async (courseId, moduleId) => {
  let sql = `SELECT id, c_id, course_module_id, unit, title, description, youtube_link FROM course_sub_module`;
  let params = [];

  if (courseId && moduleId) {
    sql += ` WHERE c_id = ? AND course_module_id = ? ORDER BY unit, id`;
    params = [courseId, moduleId];
  } else {
    sql += ` ORDER BY c_id, course_module_id, unit, id`;
  }

  const [results] = await db.query(sql, params);
  return results;
};

module.exports = { insertCourseSubModule, getCourseSubModules };
