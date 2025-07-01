// controllers/paymentController.js
import User from '../models/User.js';
import Song from '../models/Song.js';

export const purchaseSong = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'songId is required' });
    }

    const song = await Song.findById(songId);
    if (!song || song.status !== 'premium') {
      return res.status(400).json({ message: 'Invalid or non-premium song' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Record the payment
    const payment = new Payment({
      user: user._id,
      song: song._id,
      amount: song.price || 1.99, // Default price if not set
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'in-app'
    });
    await payment.save();

    // Update user's purchased songs
    if (!user.purchasedSongs.includes(songId)) {
      user.purchasedSongs.push(songId);
      await user.save();
    }

    res.json({ 
      message: 'Payment successful', 
      paymentId: payment._id 
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Payment failed' });
  }
};

export const makePayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethod } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }

    const payment = new Payment({
      user: req.user.id,
      amount,
      currency,
      paymentMethod: paymentMethod || 'unknown',
      status: 'completed'
    });
    await payment.save();

    res.json({ 
      message: 'Payment processed', 
      paymentId: payment._id 
    });
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// Add these for admin dashboard
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('song', 'title artist')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Failed to fetch payments:', err);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const stats = {
      totalRevenue: await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      monthlyRevenue: await Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    };

    res.json({
      totalRevenue: stats.totalRevenue[0]?.total || 0,
      monthlyRevenue: stats.monthlyRevenue[0]?.total || 0
    });
  } catch (err) {
    console.error('Failed to fetch payment stats:', err);
    res.status(500).json({ message: 'Failed to fetch payment statistics' });
  }
};