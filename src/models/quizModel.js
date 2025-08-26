// src/models/quizModel.js
const db = require('../config/db');

const Quiz = {
  // ✅ Fetch quizzes
  async getFiltered(courseId, moduleId, lang) {
    let sql = 'SELECT * FROM c_quiz WHERE 1=1';
    const params = [];

    if (courseId) {
      sql += ' AND c_id = ?';
      params.push(courseId);
    }
    if (moduleId) {
      sql += ' AND course_module_id = ?';
      params.push(moduleId);
    }
    if (lang === 'en') {
      sql += ' AND lang_en = 1';
    } else if (lang === 'si') {
      sql += ' AND lang_si = 1';
    } else if (lang === 'ta') {
      sql += ' AND lang_ta = 1';
    }

    console.log('🔎 Executing SQL:', sql, params);

    const [rows] = await db.query(sql, params);
    return rows;
  },

  // ✅ Create a quiz
  async create(quiz) {
    const sql = `
      INSERT INTO c_quiz (
        c_id, course_module_id, title, description, lang_en, lang_si, lang_ta
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      quiz.c_id,
      quiz.course_module_id,
      quiz.title,
      quiz.description || '',
      quiz.lang_en || 0,
      quiz.lang_si || 0,
      quiz.lang_ta || 0
    ];

    console.log('🛠 Executing SQL:', sql, values);

    const [result] = await db.query(sql, values);
    return result;
  }
};

module.exports = Quiz;
