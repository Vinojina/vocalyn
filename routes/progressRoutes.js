// routes/progressRoutes.js

import express from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/progressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/userprogress', protect, getUserProgress);
router.put('/update', protect, updateUserProgress);

export default router;
