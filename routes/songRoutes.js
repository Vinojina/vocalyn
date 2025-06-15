// routes/songRoutes.js

import express from 'express';
import {
  addSong,
  deleteSong,
  getAllSongs,
  uploadSong, 
  SongByID
} from '../controllers/songController.js';

import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

// Public route
router.get('/all-songs', getAllSongs);
router.get('/:id',SongByID);
router.post('/addSong', addSong); 

// Admin-only
router.delete('/:id', protect, isAdmin, deleteSong);

// Upload audio file via form-data
router.post('/upload', upload.single('audio'), uploadSong);

export default router;
