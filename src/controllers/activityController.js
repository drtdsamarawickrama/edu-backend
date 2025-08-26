const ActivityModel = require('../models/activityModel');

const ActivityController = {
  // Create a new activity
  createActivity: async (req, res, next) => {
    try {
      const { m_id, category, activity_text, rating, raw_date } = req.body;

      if (!m_id || !category || !activity_text || !rating || !raw_date) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }

      const dateObj = new Date(raw_date);
      if (isNaN(dateObj)) {
        return res.status(400).json({ success: false, error: 'Invalid date format.' });
      }

      const newActivity = {
        m_id,
        category,
        activity_text,
        rating,
        raw_date: dateObj,
      };

      const insertId = await ActivityModel.createActivity(newActivity);
      res.status(201).json({
        success: true,
        message: 'Activity recorded successfully.',
        activityId: insertId,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all activities for a member
  getActivities: async (req, res, next) => {
    try {
      const m_id = parseInt(req.query.m_id);
      if (!m_id) return res.status(400).json({ success: false, error: 'memberId required' });

      const activities = await ActivityModel.getAllActivities(m_id);
      res.status(200).json({ success: true, data: activities });
    } catch (error) {
      next(error);
    }
  },

  // Get daily progress summary (percentage + counts)
  getProgress: async (req, res, next) => {
    try {
      const m_id = parseInt(req.query.m_id);
      if (!m_id) return res.status(400).json({ success: false, error: 'memberId required' });

      const progress = await ActivityModel.getProgressSummary(m_id);

      // add percentage calculation
      const formatted = progress.map(row => ({
        date: row.date,
        avg_rating: row.avg_rating,
        total_activities: row.total_activities,
        progress_percentage: Math.round((row.avg_rating / 5) * 100), // assume rating is out of 5
      }));

      res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      next(error);
    }
  },

  // Delete an activity
  deleteActivity: async (req, res, next) => {
    try {
      const { id } = req.params;
      const affectedRows = await ActivityModel.deleteActivityById(id);

      if (affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Activity not found.' });
      }

      res.status(200).json({ success: true, message: 'Activity deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ActivityController;
