// src/controllers/authController.js
const bcrypt = require('bcrypt');
const memberModel = require('../models/memberModel');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, dob, gender, phone, email, password, confirm_password } = req.body;

  if (!name || !dob || !gender || !phone || !email || !password || !confirm_password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await memberModel.findUserByEmail(email);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name_with_initials: name,
      dob,
      gender: parseInt(gender),   // ensure int
      phone,
      email,
      password: hashedPassword,
      is_active: 1,
      add_date: new Date(),
    };

    await memberModel.createUser(newUser);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await memberModel.findUserByEmail(email);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // JWT token expires in 3 months (90 days)
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user[0].id,
        name: user[0].name_with_initials,
        email: user[0].email,
        phone: user[0].phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login };
