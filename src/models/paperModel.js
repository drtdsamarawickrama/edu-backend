const pool = require('../config/db');

const PaperModel = {
  async create({ grade, subject, title, year, file_path, file_size, mime_type }) {
    try {
      const sql = `
        INSERT INTO past_papers 
        (grade, subject, title, year, file_path, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const params = [
        Number(grade),
        String(subject || ''),
        String(title || ''),
        Number(year),
        String(file_path || ''),
        Number(file_size || 0),
        String(mime_type || 'application/pdf')
      ];
      const [result] = await pool.execute(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Error creating paper:', error);
      throw new Error('Failed to create paper record');
    }
  },

  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM past_papers WHERE id = ? LIMIT 1',
        [Number(id)]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding paper by ID:', error);
      throw new Error('Failed to retrieve paper');
    }
  },

  async findAll({ grade, subject, year, page = 1, limit = 50 }) {
    try {
      const where = [];
      const params = [];

      if (grade != null && !isNaN(grade)) {
        where.push('grade = ?');
        params.push(Number(grade));
      }
      if (subject) {
        where.push('subject = ?');
        params.push(String(subject));
      }
      if (year != null && !isNaN(year)) {
        where.push('year = ?');
        params.push(Number(year));
      }

      const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

      // Pagination
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));
      const offset = (pageNum - 1) * limitNum;

      // Total count
      const countSql = `SELECT COUNT(*) AS total FROM past_papers ${whereSql}`;
      const [countRows] = await pool.execute(countSql, params);
      const total = Number(countRows[0]?.total || 0);

      // Main query (safe numeric interpolation for LIMIT/OFFSET)
      const listSql = `
        SELECT id, grade, subject, title, year, file_path, file_size, mime_type, created_at
        FROM past_papers
        ${whereSql}
        ORDER BY year DESC, created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `;

      const [rows] = await pool.execute(listSql, params);

      return {
        rows,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };
    } catch (error) {
      console.error('Error finding all papers:', error);
      throw new Error('Database query failed: ' + error.message);
    }
  },

  async getDistinctGrades() {
    try {
      const [rows] = await pool.execute(
        'SELECT DISTINCT grade FROM past_papers WHERE grade IS NOT NULL ORDER BY grade ASC'
      );
      return rows.map(r => r.grade);
    } catch (error) {
      console.error('Error getting distinct grades:', error);
      throw new Error('Failed to retrieve grades');
    }
  },

  async getDistinctSubjects() {
    try {
      const [rows] = await pool.execute(
        'SELECT DISTINCT subject FROM past_papers WHERE subject IS NOT NULL AND subject != "" ORDER BY subject ASC'
      );
      return rows.map(r => r.subject);
    } catch (error) {
      console.error('Error getting distinct subjects:', error);
      throw new Error('Failed to retrieve subjects');
    }
  },

  async getDistinctYears() {
    try {
      const [rows] = await pool.execute(
        'SELECT DISTINCT year FROM past_papers WHERE year IS NOT NULL ORDER BY year DESC'
      );
      return rows.map(r => r.year);
    } catch (error) {
      console.error('Error getting distinct years:', error);
      throw new Error('Failed to retrieve years');
    }
  },

  async testConnection() {
    try {
      const [result] = await pool.execute('SELECT 1 as test');
      return result[0].test === 1;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
};

module.exports = PaperModel;
