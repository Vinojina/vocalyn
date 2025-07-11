import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Song from '../models/Song.js';

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
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.status(200).json(song);
  } catch (err) {
    console.error('Failed to fetch song by ID:', err);
    res.status(500).json({ message: 'Failed to fetch song' });
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

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ message: 'Recording uploaded successfully', fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
};