// routes/songRoutes.js
import express from 'express';
import {
  addSong,
  deleteSong,
  getAllSongs,
  uploadSong
} from '../controllers/songController.js';

import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/upload.js';

const router = express.Router();

router.get('/all-songs', getAllSongs);

router.post('/addSong', protect, isAdmin, uploadFields, addSong); // 🔥 Corrected line

router.delete('/:id', protect, isAdmin, deleteSong);

export default router;
