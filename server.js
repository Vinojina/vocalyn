import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
