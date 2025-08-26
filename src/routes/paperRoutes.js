const express = require('express');
const router = express.Router();

const { pastPaperUpload } = require('../middleware/upload');
const PaperController = require('../controllers/paperController');

// CREATE paper
router.post('/', pastPaperUpload.single('file'), PaperController.create);

// LIST papers with filters
router.get('/', PaperController.list);

// GET single paper
router.get('/:id', PaperController.getOne);

// DOWNLOAD paper
router.get('/:id/download', PaperController.download);

// GET filters
router.get('/filters/all', PaperController.getFilters);

// TEST DB connection
router.get('/test/connection', PaperController.test);

module.exports = router;
