const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProfileController = require('../controllers/profileController');

const router = express.Router();

// Ensure /uploads exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, Date.now() + ext.toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only images are allowed'));
    cb(null, true);
  },
});

router.get('/:id', ProfileController.getProfile);
router.put('/:id', upload.single('profile_image'), ProfileController.updateProfile);

module.exports = router;
