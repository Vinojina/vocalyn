import Song from '../models/Song.js';

export const addSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json({ message: 'Song added', song });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add song' });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    await song.deleteOne();
    res.json({ message: 'Song deleted' });
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
