import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Song from '../models/Song.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addSong = async (req, res) => {
  try {
    const { title, artist, status, level, genre } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioFile = req.files.audio[0];
    const validAudioTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp4'];
    if (!validAudioTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({ message: 'Unsupported audio format' });
    }

    const audioUrl = `/uploads/${audioFile.filename}`;

    let lyricsContent = '';
    if (req.files.lyricsFile) {
      const lyricsPath = path.join(__dirname, '..', 'uploads', req.files.lyricsFile[0].filename);
      lyricsContent = await fs.promises.readFile(lyricsPath, 'utf-8');
    }

    const newSong = new Song({
      title,
      artist,
      status,
      level,
      genre,
      audioUrl,
      lyrics: lyricsContent,
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
    const songId = req.params.id;
    const song = await Song.findByIdAndDelete(songId);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const audioFilePath = path.join(__dirname, '..', song.audioUrl);
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error('Failed to delete audio file:', err);
    });

    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (err) {
    console.error('Failed to delete song:', err);
    res.status(500).json({ message: 'Failed to delete song' });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    console.log("⏳ Fetching all songs from DB...");
    const songs = await Song.find();
    console.log("✅ Songs fetched:", songs.length);
    res.status(200).json(songs);
  } catch (err) {
    console.error("❌ Failed to fetch songs:", err.message);
    res.status(500).json({ message: "Failed to fetch songs", error: err.message });
  }
};

export const getSongById = async (req, res) => {
  try {
    const songId = req.params.id;
    // Validate MongoDB ObjectId format
    if (!songId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid song ID format' });
    }
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (err) {
    console.error('Failed to fetch song by ID:', err);
    res.status(500).json({ message: 'Failed to fetch song', error: err.message });
  }
};
export const uploadSong = async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = `/uploads/${req.files.audio[0].filename}`;
    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error('Failed to upload song:', err);
    res.status(500).json({ message: 'Failed to upload song' });
  }
};

export const uploadRecording = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Save the recording as a Song associated with the user
    const newSong = new Song({
      user: req.user._id,
      title: req.body.title || req.file.originalname || 'Untitled Recording',
      artist: req.body.artist || req.user.name || 'Unknown',
      audioUrl: fileUrl,
      lyrics: req.body.lyrics || '',
      genre: req.body.genre || '',
      level: req.body.level || 'beginner',
      status: 'free',
    });
    await newSong.save();

    res.status(201).json({
      message: 'Recording uploaded and saved successfully',
      fileUrl,
      song: newSong
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
};

// Helper: filter songs by payment status for user
export const getSongsByLevelForUser = async (req, res) => {
  try {
    const { level } = req.params;
    const user = req.user; 
    const songs = await Song.find({ level });

    // If user is admin, return all songs
    if (user && (user.role === 'admin' || user.isAdmin)) {
      return res.status(200).json(songs);
    }

    const paidSongs = user?.paidSongs || [];
    const filtered = songs.map(song => {
      if (song.status === 'free') {
        return { ...song.toObject(), locked: false };
      } else {
        // premium song
        const unlocked = paidSongs.includes(song._id.toString());
        return { ...song.toObject(), locked: !unlocked };
      }
    });
    res.status(200).json(filtered);
  } catch (error) {
    console.error('Failed to fetch songs by level for user:', error);
    res.status(500).json({ message: 'Failed to fetch songs', error: error.message });
  }
};