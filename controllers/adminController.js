import User from '../models/User.js';
import Song from '../models/Song.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ getAllUsers:', error.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name}'s role updated to '${role}'`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        newRole: user.role
      }
    });
  } catch (error) {
    console.error('❌ updateUserRole:', error.message);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

/**
 * @desc    Middleware fallback: Manual admin check (rare use)
 */
export const adminOnlyController = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ getUserById:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find({});
    res.status(200).json(songs);
  } catch (error) {
    console.error('❌ getAllSongs:', error.message);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
};
