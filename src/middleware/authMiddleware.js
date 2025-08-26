// src/middlewares/authMiddleware.js
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Validation for signup
const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('dob')
    .trim()
    .notEmpty()
    .withMessage('Date of Birth is required'),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .custom((value) => {
      const allowed = [1, 2, 3, '1', '2', '3'];
      return allowed.includes(value);
    })
    .withMessage('Invalid gender'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10}$/)
    .withMessage('Invalid 10-digit phone number'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgs = errors.array().map((err) => err.msg);
      return res.status(400).json({ message: errorMsgs.join(', ') });
    }
    next();
  },
];

// Validation for login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgs = errors.array().map((err) => err.msg);
      return res.status(400).json({ message: errorMsgs.join(', ') });
    }
    next();
  },
];

// JWT token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { validateSignup, validateLogin, verifyToken };
