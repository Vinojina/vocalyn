import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getUserProgress, updateUserProgress } from '../controllers/progressController.js';

const router = express.Router();

router.get('/userprogress', protect, getUserProgress);
router.post('/updateprogress', protect, updateUserProgress);

export default router;
