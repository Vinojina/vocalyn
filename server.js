import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import songRoutes from './routes/songRoutes.js';  // Make sure this import path is correct
import sessionRoutes from './routes/sessionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => res.send("API is working"));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/songs', songRoutes);  // Only mount once

// Error handling middleware (ADD THIS)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// 404 handler (ADD THIS)
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    attemptedUrl: req.originalUrl
  });
});

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.set('Content-Type', 'audio/mpeg');
    }
}));
  
// In your Express server (app.js)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
      const ext = path.split('.').pop().toLowerCase();
      const mimeTypes = {
        mp3: 'audio/mpeg',
        ogg: 'audio/ogg',
        wav: 'audio/wav',
        m4a: 'audio/mp4'
      };
      if (mimeTypes[ext]) {
        res.set('Content-Type', mimeTypes[ext]);
        res.set('Accept-Ranges', 'bytes');
      }
    }
}));
  
app.use((err, req, res, next) => {
    console.error('Server error:', {
      path: req.path,
      method: req.method,
      error: err.stack
    });
    res.status(500).json({ error: 'Internal server error' });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));