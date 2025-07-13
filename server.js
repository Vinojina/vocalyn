import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import songRoutes from './routes/songRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import feedbackRoute from './routes/feedback.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:5002'],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files with correct audio headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase().substring(1); // remove "."
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4'
    };
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
      res.setHeader('Accept-Ranges', 'bytes'); // enables seeking
    }
  }
}));

// Basic route
app.get("/", (req, res) => res.send("API is working"));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/feedback', feedbackRoute);


// 🔻 Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 🔻 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', attemptedUrl: req.originalUrl });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
console.log('Server is starting...');