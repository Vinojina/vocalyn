import express from 'express';
import { addSong } from '../controllers/songController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/upload.js';

const router = express.Router();

router.post('/add', protect, isAdmin, uploadFields, addSong);
router.get('/all', protect, getAllSongs);
router.delete('/:id', protect, isAdmin, deleteSong);
