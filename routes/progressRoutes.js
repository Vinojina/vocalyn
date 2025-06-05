// routes/progressRoutes.js

import express from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserProgress);
router.put('/', protect, updateUserProgress);

export default router;
