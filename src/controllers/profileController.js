const ProfileModel = require('../models/profileModel');
const path = require('path');

function makeAbsoluteImageUrl(req, storedPath) {
  if (!storedPath) return '';
  if (storedPath.startsWith('http://') || storedPath.startsWith('https://')) {
    return storedPath;
  }
  // absolute URL for Flutter convenience
  const host = req.get('host'); // e.g., 127.0.0.1:5000
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}${storedPath.startsWith('/') ? storedPath : '/' + storedPath}`;
}

const ProfileController = {
  async getProfile(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const row = await ProfileModel.getProfileById(id);
      if (!row) return res.status(404).json({ error: 'User not found' });

      // Ensure absolute image
      row.profile_image = makeAbsoluteImageUrl(req, row.profile_image);

      return res.json(row);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Database error' });
    }
  },

  async updateProfile(req, res) {
    try {
      const id = parseInt(req.params.id, 10);

      // Validate incoming fields
      const {
        first_name = null,
        last_name = null,
        dob = null,
        gender = null, // expect '1' | '2' | '3'
        phone = null,
        email = null,
        profile_image: oldImage = null,
      } = req.body;

      let profile_image = oldImage;
      if (req.file) {
        profile_image = '/uploads/' + req.file.filename;
      }

      const ok = await ProfileModel.updateProfile(id, {
        first_name,
        last_name,
        dob,
        gender: gender ? parseInt(gender, 10) : null,
        phone,
        email,
        profile_image,
      });

      if (!ok) return res.status(400).json({ error: 'Update failed' });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile_image: makeAbsoluteImageUrl(req, profile_image),
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Update failed' });
    }
  },
};

module.exports = ProfileController;
