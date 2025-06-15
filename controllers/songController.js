import multer from 'multer';
import Song from '../models/Song.js';

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (ext === 'mp3' || ext === 'wav' || ext === 'm4a') {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });
export const uploadMiddleware = upload.single('audio'); // ⬅️ Middleware for routes

// === Controllers ===

export const addSong = async (req, res) => {
  try {
    const { title, artist, status, level, genre, lyrics } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = `/uploads/${req.file.filename}`;

    const newSong = new Song({
      title,
      artist,
      status,
      level,
      genre,
      audioUrl,
      lyrics,
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    console.error('Failed to upload song:', err);
    res.status(500).json({ message: 'Failed to upload song' });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    await song.deleteOne();
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete song' });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
};

export const SongByID = async (req, res) => {
  try {
    const { title, artist, status, level, genre, lyrics, audioUrl } = req.body;

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    song.title = title || song.title;
    song.artist = artist || song.artist;
    song.status = status || song.status;
    song.level = level || song.level;
    song.genre = genre || song.genre;
    song.lyrics = lyrics || song.lyrics;
    song.audioUrl = audioUrl || song.audioUrl;

    if (req.file) {
      const newAudioUrl = `/uploads/${req.file.filename}`;
      song.audioUrl = newAudioUrl;
    }

    await song.save();
    res.json(song);
  } catch (err) {
    console.error('Failed to update song:', err);
    res.status(500).json({ message: 'Failed to update song' });
  }
};

export const uploadSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error('Failed to upload audio:', err);
    res.status(500).json({ message: 'Failed to upload audio' });
  }
};
