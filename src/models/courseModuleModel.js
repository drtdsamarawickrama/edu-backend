const db = require('../config/db');

// Insert course module - returns a Promise
const insertCourseModule = async (data) => {
  const sql = `INSERT INTO course_module 
    (c_id, title, topic_no, lang_en, lang_si, lang_ta) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    data.c_id,
    data.title,
    data.topic_no,
    data.lang_en,
    data.lang_si,
    data.lang_ta,
  ];

  const [result] = await db.query(sql, values);
  return result;
};

// Get all course modules - returns a Promise
const getAllCourseModules = async () => {
  const sql = 'SELECT * FROM course_module';
  const [results] = await db.query(sql);
  return results;
};

module.exports = { insertCourseModule, getAllCourseModules };
