const db = require('../config/db');

const QuizMarkModel = {
  async storeMark({ m_id, c_q_id, c_q_question_id, c_q_q_answers_id, marks }) {
    const sql = `
      INSERT INTO c_q_m_answer 
      (m_id, c_q_id, c_q_question_id, c_q_q_answers_id, marks, date)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const params = [m_id, c_q_id, c_q_question_id, c_q_q_answers_id, marks];
    const [result] = await db.query(sql, params);
    return result;
  },

  // All attempts (flat list) with quiz title, marks, total questions, and date
  async getAllAttempts(m_id) {
    const sql = `
      SELECT 
        DATE(a.date) AS date,
        q.title AS quiz_title,
        a.marks,
        (SELECT COUNT(*) 
         FROM c_q_question qq 
         WHERE qq.q_id = a.c_q_id) AS total_questions
      FROM c_q_m_answer a
      JOIN c_quiz q ON a.c_q_id = q.id
      WHERE a.m_id = ?
      ORDER BY a.date DESC, a.id ASC
    `;
    const [rows] = await db.query(sql, [m_id]);
    return rows.map(r => ({
      date: r.date.toISOString().slice(0, 10), // YYYY-MM-DD
      quiz_title: r.quiz_title,
      marks: r.marks,
      total_questions: r.total_questions,
    }));
  },

  // Median progress per day (percentage)
  async getProgressByDate(m_id) {
    const sql = `
      SELECT DATE(a.date) AS date,
             a.marks,
             (SELECT COUNT(*) FROM c_q_question qq WHERE qq.q_id = a.c_q_id) AS total_questions
      FROM c_q_m_answer a
      WHERE a.m_id = ?
      ORDER BY a.date ASC
    `;
    const [rows] = await db.query(sql, [m_id]);

    const grouped = {};
    rows.forEach(r => {
      const dateStr = r.date.toISOString().slice(0, 10);
      const percentage = r.total_questions > 0 ? (r.marks / r.total_questions) * 100 : 0;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(percentage);
    });

    // Calculate median per day
    const result = Object.entries(grouped).map(([date, values]) => {
      values.sort((a, b) => a - b);
      const mid = Math.floor(values.length / 2);
      const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
      return { date, median };
    });

    return result;
  }
};

module.exports = QuizMarkModel;
