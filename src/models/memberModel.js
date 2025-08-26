// src/models/memberModel.js
const db = require('../config/db');

// Create a new user (used in signup)
const createUser = async (user) => {
  const sql = `
    INSERT INTO member 
    (name_with_initials, dob, gender, phone, email, password, is_active, add_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    user.name_with_initials,
    user.dob,
    user.gender,
    user.phone,
    user.email,
    user.password,
    user.is_active || 1,          // default active
    user.add_date || new Date(),  // default now
  ];
  const [result] = await db.query(sql, values);
  return result;
};

// Find a user by email (used for login and checking existing user)
const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM member WHERE email = ? LIMIT 1';
  const [rows] = await db.query(sql, [email]);
  return rows;
};

// Optional: Get public profile (if needed after login)
const getUserProfileByEmail = async (email) => {
  const sql = `
    SELECT id, name_with_initials, dob, gender, phone, email
    FROM member
    WHERE email = ?
  `;
  const [rows] = await db.query(sql, [email]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserProfileByEmail,
};
