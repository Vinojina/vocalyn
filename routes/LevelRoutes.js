// routes/levelRoutes.js

import express from 'express';
import {
  addLevel,
  deleteLevel,
  getAllLevels,
} from '../controllers/LevelController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all levels
router.get('/all-levels', getAllLevels);

// Admin-only routes
router.post('/add-levels', protect, isAdmin, addLevel);
router.delete('/:id', protect, isAdmin, deleteLevel);

export default router;
