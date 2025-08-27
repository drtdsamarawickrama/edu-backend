// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Ensure Uploads Folder Exists ──────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}



// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(helmet());

// Enable morgan only in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());

// ─── Database Connection ───────────────────────────────────────────────────────
const db = require('./src/config/db');

// ─── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const courseRoutes = require('./src/routes/courseRoutes'); 
const courseModuleRoutes = require('./src/routes/courseModuleRoutes');
const courseSubModuleRoutes = require('./src/routes/courseSubModuleRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const quizQuestionRoutes = require('./src/routes/quizQuestionRoutes');
const quizAnswerRoutes = require('./src/routes/quizAnswerRoutes');
const quizMarksRoutes = require('./src/routes/quizMarkRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const pastPaperRoutes = require('./src/routes/paperRoutes'); 
const passwordRoutes = require('./src/routes/passwordRoutes');

// ─── Error Middleware ─────────────────────────────────────────────────────────
const errorHandler = require('./src/utils/errorMiddleware');

// ─── Route Mounting ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.use('/api/courses', courseRoutes); 
app.use('/api/course-modules', courseModuleRoutes);
app.use('/api/course-sub-modules', courseSubModuleRoutes);

app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-questions', quizQuestionRoutes);
app.use('/api/quiz-answers', quizAnswerRoutes);
app.use('/api/quiz-marks', quizMarksRoutes);

// ─── Activity Routes ───────────────────────────────────────────────────────────
app.use('/api/activities', activityRoutes);

// ─── Past Papers Routes (✅ keep last, no overlap) ──────────────────────────────
app.use('/api/papers', pastPaperRoutes); 

// ─── Password Routes (Forgot / Verify / Reset) ────────────────────────────────
app.use('/api/password', passwordRoutes);

// ─── Static Files (Uploads) ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Error Middleware (keep after routes & static) ─────────────────────────────
app.use(errorHandler);

 
// export default function handler(req, res) {
//   res.status(200).json({ message: "Hello from Vercel Node API!" });
// }