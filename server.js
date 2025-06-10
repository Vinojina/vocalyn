import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import songRoutes from './routes/songRoutes.js';
import levelRoutes from './routes/LevelRoutes.js';



dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Mount admin routes properly
app.use('/api/admin', adminRoutes); // This makes /api/admin/users work
app.use('/api/auth', authRoutes); // Assuming you have authRoutes defined
app.use('/api/users', userRoutes); // Assuming you have userRoutes defined
app.use('/api/sessions', sessionRoutes); // Assuming you have sessionRoutes defined
app.use('/api/songs', songRoutes);
app.use('/api/levels', levelRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
