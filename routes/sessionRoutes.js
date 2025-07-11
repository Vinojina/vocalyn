import express from 'express';
import {
  startSession,
  completeSession,
  submitSongForFeedback,
} from '../controllers/sessionController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startSession);
router.post('/complete', protect, completeSession);
router.post('/submit-song', protect, submitSongForFeedback);

export default router;
