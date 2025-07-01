import express from 'express';
import {
  addSong,
  deleteSong,
  getAllSongs,
  uploadSong
} from '../controllers/songController.js';
import Song from '../models/Song.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/upload.js';

const router = express.Router();

// Get songs by level
router.get('/beginner', async (req, res) => {
  try {
    const songs = await Song.find({ level: 'beginner' });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/intermediate', async (req, res) => {
  try {
    const songs = await Song.find({ level: 'intermediate' });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/advanced', async (req, res) => {
  try {
    const songs = await Song.find({ level: 'advanced' });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single song - CORRECTED PATH
router.get('/:songId', async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// In your backend (routes/songs.js)
router.get('/all-songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});

// Admin routes
router.get('/all-songs', getAllSongs);
router.post('/addSong', protect, isAdmin, uploadFields, addSong);
router.delete('/:id', protect, isAdmin, deleteSong);

export default router;