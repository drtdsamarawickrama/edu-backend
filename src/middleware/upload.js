const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Ensure upload folders exist ───────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../uploads');
const pastPapersDir = path.join(uploadsDir, 'pastpapers');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(pastPapersDir)) fs.mkdirSync(pastPapersDir, { recursive: true });

// ─── IMAGE UPLOAD (unchanged) ─────────────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
};

// ─── PAST PAPER UPLOAD (PDF only) ─────────────────────────────────────────────
const pastPaperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure pastpapers directory exists at runtime
    if (!fs.existsSync(pastPapersDir)) fs.mkdirSync(pastPapersDir, { recursive: true });
    cb(null, pastPapersDir);
  },
  filename: (req, file, cb) => {
    // Sanitize file name and preserve extension
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const pastPaperFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype === 'application/pdf';

  if (ext === '.pdf' && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for past papers'));
  }
};

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
module.exports = {
  imageUpload: multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: imageFileFilter,
  }),
  pastPaperUpload: multer({
    storage: pastPaperStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: pastPaperFileFilter,
  }),
};
