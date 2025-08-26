// src/config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Load environment variables with safe defaults
const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'edu_db',
  DB_PORT = 3306, // ✅ default MySQL port
} = process.env;

// Create a MySQL connection pool
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the DB connection once on startup
(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    console.log('✅ MySQL database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // stop app if DB fails
  }
})();

module.exports = db;
