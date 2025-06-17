// controllers/progressController.js
import Progress from '../models/progress.js';
import Song from '../models/Song.js';

// GET user progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const completedSongs = await Song.find({ _id: { $in: progress.completedSongs } });

    const formattedSongs = completedSongs.map(song => ({
      songId: song._id,
      title: song.title,
      level: song.level,
    }));

    res.status(200).json({
      userId: progress.user,
      completedSongs: formattedSongs,
      currentLevel: progress.levelUnlocked,
      totalSongsCompleted: formattedSongs.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// PUT or POST to update progress
export const updateUserProgress = async (req, res) => {
  try {
    const { songId, level } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      // create new progress if not exists
      progress = new Progress({
        user: userId,
        completedSongs: [songId],
        levelUnlocked: level || 'beginner',
      });
    } else {
      // avoid duplicate song entries
      if (!progress.completedSongs.includes(songId)) {
        progress.completedSongs.push(songId);
      }

      if (level && level !== progress.levelUnlocked) {
        progress.levelUnlocked = level;
      }
    }

    await progress.save();

    res.status(200).json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};
