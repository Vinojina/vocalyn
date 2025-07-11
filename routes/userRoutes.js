import express from 'express';
import multer from 'multer';
import {
  createUser,
  getMyProfile,
  updateMyProfile,
  getUserDashboard,
  uploadSong,
  deleteSong,
  getMySongs,
  updateUserRole
} from '../controllers/userController.js';

import { protect, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth Routes
router.post('/register', createUser);

// Profile
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);

// Dashboard
router.get('/dashboard', protect, getUserDashboard);

// Songs
router.post('/songs', protect, upload.single('audio'), uploadSong);
router.get('/songs', protect, getMySongs);
router.delete('/songs/:id', protect, deleteSong);

// Role update (admin only)
router.put('/:id/role', protect, checkRole('admin'), updateUserRole);

// ✅ /api/users/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const songs = await Song.find({ user: req.user.id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      songs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
});


export default router;
