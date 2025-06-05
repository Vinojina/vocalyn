import express from 'express';
const router = express.Router();

import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';

import { protect , isAdmin} from '../middleware/authMiddleware.js';

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (only accessible if token is valid)
router.get('/profile', protect, getUserProfile);

export default router;
