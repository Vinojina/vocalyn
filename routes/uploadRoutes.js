// import express from 'express';
// import { addSong } from '../controllers/adminController.js';
// import { protect, isAdmin } from '../middlewares/authMiddleware.js';
// import { uploadFields } from '../middlewares/upload.js';

// const router = express.Router();

// router.post('/add', protect, isAdmin, uploadFields, addSong);
// router.get('/all', protect, getAllSongs);
// router.delete('/:id', protect, isAdmin, deleteSong);


// routes/uploadRoute.js
import express from 'express';
import { uploadFields } from '../middlewares/upload.js';
import { addSong } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/upload', uploadFields, (req, res) => {
  try {
    const audio = req.files['audio']?.[0];
    const lyricsFile = req.files['lyricsFile']?.[0];

    if (!audio || !lyricsFile) {
      return res.status(400).json({ error: 'Both audio and lyrics files are required.' });
    }

    // Read the lyrics content
    const lyricsPath = path.resolve(lyricsFile.path);
    const lyricsText = fs.readFileSync(lyricsPath, 'utf-8');

    return res.status(200).json({
      message: 'Files uploaded successfully',
      audioFile: {
        originalName: audio.originalname,
        path: audio.path,
      },
      lyricsFile: {
        originalName: lyricsFile.originalname,
        path: lyricsFile.path,
        content: lyricsText,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
