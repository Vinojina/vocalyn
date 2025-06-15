import User from '../models/User.js';
import Song from '../models/Song.js';

export const purchaseSong = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song || song.status !== 'premium') {
      return res.status(400).json({ message: 'Invalid or non-premium song' });
    }

    // Simulate payment success
    const user = await User.findById(userId);
    if (!user.purchasedSongs.includes(songId)) {
      user.purchasedSongs.push(songId);
      await user.save();
    }

    res.status(200).json({ message: 'Payment successful. Song unlocked.' });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed' });
  }
};
// controllers/paymentController.js

export const makePayment = (req, res) => {
  res.status(200).json({ message: 'payment successful' });
};

