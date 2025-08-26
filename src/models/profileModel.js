const db = require('../config/db');

const ProfileModel = {
  async getProfileById(id) {
    const [rows] = await db.query(
      `SELECT 
         id,
         name_with_initials,
         first_name,
         last_name,
         dob,
         gender,          -- 1,2,3
         phone,
         email,
         profile_image
       FROM member
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async updateProfile(id, data) {
    const sql = `
      UPDATE member
         SET first_name = ?,
             last_name = ?,
             dob = ?,
             gender = ?,
             phone = ?,
             email = ?,
             profile_image = ?
       WHERE id = ?`;
    const params = [
      data.first_name || null,
      data.last_name || null,
      data.dob || null,
      data.gender || null,
      data.phone || null,
      data.email || null,
      data.profile_image || null,
      id,
    ];
    const [res] = await db.query(sql, params);
    return res.affectedRows === 1;
  },
};

module.exports = ProfileModel;
