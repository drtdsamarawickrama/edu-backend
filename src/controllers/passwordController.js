const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const PasswordModel = require('../models/passwordModel');

// Configure Nodemailer (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

const PasswordController = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await PasswordModel.findByEmail(email);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await PasswordModel.saveOtp(email, otp);

      await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp} (valid 15 mins)`);

      res.json({ message: 'OTP sent to your email' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const data = await PasswordModel.verifyOtp(email, otp);
      if (!data) return res.status(400).json({ message: 'Invalid or expired OTP' });

      res.json({ message: 'OTP verified successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const data = await PasswordModel.verifyOtp(email, otp);
      if (!data) return res.status(400).json({ message: 'Invalid or expired OTP' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await PasswordModel.updatePassword(data.id, hashedPassword);

      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = PasswordController;
