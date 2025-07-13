import express from 'express';
import {
  addSong,
  deleteSong,
  getSongById,
  getSongsByLevelForUser
} from '../controllers/songController.js';
import Song from '../models/Song.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/upload.js';
import upload from '../middlewares/upload.js';
import { uploadRecording } from '../controllers/songController.js';
const router = express.Router();

console.log('songRoutes.js loaded');

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


router.get('/all-songs', protect, async (req, res) => {
  console.log('GET /all-songs called');
  try {
    const songs = await Song.find({});
    res.status(200).json(songs);
  } catch (error) {
    console.error('❌ getAllSongs error:', error); // Log full error object
    res.status(500).json({ message: 'Failed to fetch songs', error: error.message, stack: error.stack });
  }
});

// Get songs by level for user (with lock logic)
router.get('/level/:level', protect, getSongsByLevelForUser);

router.get ('song/:id',getSongById); 
router.post('/addSong', protect, isAdmin, uploadFields, addSong);
router.delete('/:id', protect, isAdmin, deleteSong);
router.post('/recordings', upload.single('recording'), uploadRecording);


export default router;