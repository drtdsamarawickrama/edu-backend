const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const PaperModel = require('../models/paperModel');
const pool = require('../config/db');

// Helpers
function getBaseUrl(req) {
  const envBase = process.env.APP_BASE_URL;
  if (envBase) return envBase.replace(/\/+$/, '');
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

function toPublicUrl(req, relativeFilePath) {
  return `${getBaseUrl(req)}/uploads/${String(relativeFilePath || '').replace(/\\/g, '/')}`;
}

// CREATE
exports.create = asyncHandler(async (req, res) => {
  const { title, subject, grade, year } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'PDF file is required (field name: file)' });
  }
  if (!title || !subject || !grade || !year) {
    return res.status(400).json({ success: false, error: 'All fields (title, subject, grade, year) are required' });
  }

  const relPath = path.posix.join('pastpapers', path.basename(req.file.path));
  const id = await PaperModel.create({
    title: title.trim(),
    subject: subject.trim(),
    grade: Number(grade),
    year: Number(year),
    file_path: relPath,
    file_size: Number(req.file.size || 0),
    mime_type: req.file.mimetype || 'application/pdf'
  });

  res.status(201).json({
    success: true,
    id,
    title: title.trim(),
    subject: subject.trim(),
    grade: Number(grade),
    year: Number(year),
    file_url: toPublicUrl(req, relPath),
    download_url: `${getBaseUrl(req)}/api/papers/${id}/download`
  });
});

// LIST
exports.list = asyncHandler(async (req, res) => {
  const grade = req.query.grade && !isNaN(req.query.grade) ? Number(req.query.grade) : null;
  const year = req.query.year && !isNaN(req.query.year) ? Number(req.query.year) : null;
  const subject = req.query.subject ? String(req.query.subject).trim() : null;
  const page = req.query.page && !isNaN(req.query.page) ? Number(req.query.page) : 1;
  const limit = req.query.limit && !isNaN(req.query.limit) ? Number(req.query.limit) : 50;

  const result = await PaperModel.findAll({ grade, subject, year, page, limit });

  const grouped = {};
  for (const r of result.rows) {
    const g = Number(r.grade);
    if (!grouped[g]) grouped[g] = {};
    if (!grouped[g][r.subject]) grouped[g][r.subject] = [];
    grouped[g][r.subject].push({
      id: r.id,
      title: r.title,
      subject: r.subject,
      grade: g,
      year: Number(r.year),
      file_url: toPublicUrl(req, r.file_path),
      download_url: `${getBaseUrl(req)}/api/papers/${r.id}/download`,
      created_at: r.created_at,
      file_size: r.file_size,
      mime_type: r.mime_type
    });
  }

  res.json({
    success: true,
    data: grouped,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  });
});

// GET ONE
exports.getOne = asyncHandler(async (req, res) => {
  const paperId = Number(req.params.id);
  if (isNaN(paperId)) return res.status(400).json({ success: false, error: 'Invalid paper ID' });

  const paper = await PaperModel.findById(paperId);
  if (!paper) return res.status(404).json({ success: false, error: 'Paper not found' });

  res.json({
    success: true,
    id: paper.id,
    title: paper.title,
    subject: paper.subject,
    grade: Number(paper.grade),
    year: Number(paper.year),
    file_url: toPublicUrl(req, paper.file_path),
    download_url: `${getBaseUrl(req)}/api/papers/${paper.id}/download`,
    created_at: paper.created_at,
    file_size: paper.file_size,
    mime_type: paper.mime_type
  });
});

// DOWNLOAD
exports.download = asyncHandler(async (req, res) => {
  const paperId = Number(req.params.id);
  if (isNaN(paperId)) return res.status(400).json({ success: false, error: 'Invalid paper ID' });

  const paper = await PaperModel.findById(paperId);
  if (!paper) return res.status(404).json({ success: false, error: 'Paper not found' });

  const abs = path.join(__dirname, '../../uploads', paper.file_path);
  if (!fs.existsSync(abs)) return res.status(404).json({ success: false, error: 'File not found on server' });

  const safeSubject = String(paper.subject || '').replace(/[^\w\s-]/g, '');
  const safeTitle = String(paper.title || '').replace(/[^\w\s-]/g, '');

  res.setHeader('Content-Type', paper.mime_type || 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeSubject} - ${safeTitle} (${paper.year}).pdf"`);
  res.setHeader('Content-Length', paper.file_size);

  res.sendFile(abs);
});

// FILTERS
exports.getFilters = asyncHandler(async (req, res) => {
  const [grades, subjects, years] = await Promise.all([
    PaperModel.getDistinctGrades(),
    PaperModel.getDistinctSubjects(),
    PaperModel.getDistinctYears()
  ]);

  res.json({
    success: true,
    filters: {
      grades: grades.filter(g => g != null),
      subjects: subjects.filter(s => s != null && s !== ''),
      years: years.filter(y => y != null)
    }
  });
});

// TEST
exports.test = asyncHandler(async (req, res) => {
  const connectionTest = await PaperModel.testConnection();
  if (!connectionTest) {
    return res.status(500).json({ success: false, error: 'Database connection test failed' });
  }

  let rowCount = 0;
  let tableExists = true;
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM past_papers');
    rowCount = rows[0].count;
  } catch {
    tableExists = false;
  }

  res.json({
    success: true,
    message: 'Database connection successful',
    tableExists,
    rowCount,
    timestamp: new Date().toISOString()
  });
});
