// src/controllers/courseController.js
const Course = require('../models/courseModel');

// Add a new course with title and lang
const addCourse = async (req, res) => {
  try {
    const { title, lang } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Course title is required and must be a non-empty string.' });
    }

    if (lang === undefined || isNaN(lang)) {
      return res.status(400).json({ message: 'Course lang is required and must be a number.' });
    }

    const result = await Course.insertCourse({ title: title.trim(), lang });

    res.status(201).json({
      message: 'Course inserted successfully',
      courseId: result.insertId,
    });
  } catch (error) {
    console.error('Insert course error:', error.message || error);
    res.status(500).json({ message: 'Failed to insert course.' });
  }
};

// Get all courses (id + title only)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Fetch course error:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch courses.' });
  }
};

module.exports = { addCourse, getAllCourses };
