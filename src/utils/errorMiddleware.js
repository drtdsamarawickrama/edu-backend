// Centralized error handler so you don't get vague 500s
module.exports = (err, req, res, next) => {
  // Multer "fileFilter" or size errors
  if (err && err.message && /Only PDF files/.test(err.message)) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large' });
  }

  // Joi validation errors (we send them as 400 already, but just in case)
  if (err && err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.details || err.message
    });
  }

  // MySQL parameter error commonly seen
  if (err && err.message && /mysqld_stmt_execute/i.test(err.message)) {
    return res.status(400).json({
      success: false,
      error: 'Bad request: invalid parameter types (check grade/year/page/limit)'
    });
  }

  // Fallback
  console.error('Error Middleware:', err.message || err);
  res.status(500).json({ success: false, error: 'Internal server error' });
};
