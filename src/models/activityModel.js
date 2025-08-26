const db = require('../config/db');

const ActivityModel = {
  // Create a new activity
  createActivity: async ({ m_id, category, activity_text, rating, raw_date }) => {
    const sql = `
      INSERT INTO activity (m_id, category, activity_text, rating, raw_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [m_id, category, activity_text, rating, raw_date]);
    return result.insertId;
  },

  // Fetch all activities by memberId (join with member to get student name)
  getAllActivities: async (m_id) => {
    const [rows] = await db.query(
      `
      SELECT a.id, CONCAT(m.first_name, ' ', m.last_name) AS student_name,
             a.category, a.activity_text, a.rating, a.raw_date, a.created_at
      FROM activity a
      JOIN member m ON a.m_id = m.id
      WHERE a.m_id = ?
      ORDER BY a.raw_date DESC
      `,
      [m_id]
    );
    return rows;
  },

  // Fetch daily progress summary
  getProgressSummary: async (m_id) => {
    const [rows] = await db.query(
      `
      SELECT DATE(raw_date) AS date,
             AVG(rating) AS avg_rating,
             COUNT(*) AS total_activities
      FROM activity
      WHERE m_id = ?
      GROUP BY DATE(raw_date)
      ORDER BY DATE(raw_date) ASC
      `,
      [m_id]
    );
    return rows;
  },

  // Delete activity by ID
  deleteActivityById: async (id) => {
    const [result] = await db.query(`DELETE FROM activity WHERE id = ?`, [id]);
    return result.affectedRows;
  },
};

module.exports = ActivityModel;
