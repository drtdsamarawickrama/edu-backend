const db = require('../config/db');

// Find member by email
const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM member WHERE email = ?', [email]);
  return rows[0];
};

// Update password
const updatePassword = async (id, hashedPassword) => {
  await db.query('UPDATE member SET password = ?, otp=NULL, otp_expires=NULL WHERE id = ?', [hashedPassword, id]);
};

// Save OTP and expiry directly in member table
const saveOtp = async (email, otp) => {
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await db.query('UPDATE member SET otp=?, otp_expires=? WHERE email=?', [otp, expires, email]);
};

// Verify OTP
const verifyOtp = async (email, otp) => {
  const [rows] = await db.query('SELECT * FROM member WHERE email=? AND otp=? AND otp_expires>?', [email, otp, Date.now()]);
  return rows[0];
};

module.exports = {
  findByEmail,
  updatePassword,
  saveOtp,
  verifyOtp,
};
