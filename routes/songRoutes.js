// routes/songRoutes.js

import express from 'express';
import {
  addSong,
  deleteSong,
  getAllSongs,
} from '../controllers/songController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all songs
router.get('/', getAllSongs);

// Admin-only routes
router.post('/', protect, isAdmin, addSong);
router.delete('/:id', protect, isAdmin, deleteSong);

export default router;
