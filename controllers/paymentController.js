import User from '../models/User.js';
import Song from '../models/Song.js';

export const purchaseSong = async (req, res) => {
  try {
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User info missing' });
    }

    const userId = req.user.id;
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ message: 'songId is required in the body' });
    }

    const song = await Song.findById(songId);
    if (!song || song.status !== 'premium') {
      return res.status(400).json({ message: 'Invalid or non-premium song' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize purchasedSongs if missing or not array
    if (!Array.isArray(user.purchasedSongs)) {
      user.purchasedSongs = [];
    }

    if (!user.purchasedSongs.includes(songId)) {
      user.purchasedSongs.push(songId);
      await user.save();
    }

    res.status(200).json({ message: 'Payment successful. Song unlocked.' });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Payment failed' });
  }
};
export const makePayment = async (req, res) => {
  try {
    console.log('Payment request body:', req.body);

    // Here you would typically integrate with a payment gateway
    // For now, we will just simulate a successful payment
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }

    // Simulate payment processing
    console.log(`Processing payment of ${amount} ${currency}`);
    
    // Respond with success
    res.status(200).json({ message: 'Payment processed successfully' });
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};
