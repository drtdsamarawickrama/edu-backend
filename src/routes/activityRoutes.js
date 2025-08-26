const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activityController');

// POST /api/activities
router.post('/', ActivityController.createActivity);

// GET /api/activities?m_id=1
router.get('/', ActivityController.getActivities);

// GET /api/activities/progress?m_id=1
router.get('/progress', ActivityController.getProgress);

// DELETE /api/activities/:id
router.delete('/:id', ActivityController.deleteActivity);

module.exports = router;
