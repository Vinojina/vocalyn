import User from '../models/User.js';
import Song from '../models/Song.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utility: Generate token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// ✅ Register new user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    const savedUser = await user.save();

    const token = generateToken({ id: savedUser._id, role: savedUser.role });

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        songs: [],
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// ✅ Get logged-in user's profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update profile
export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// ✅ User dashboard
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const songs = await Song.find({ user: req.user.id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      songs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Upload song (audio)
export const uploadSong = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file uploaded' });

    const song = new Song({
      user: req.user.id,
      title: req.body.title,
      audio: req.file.buffer,
      mimetype: req.file.mimetype,
    });

    await song.save();
    res.status(201).json({ message: 'Song uploaded', song });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete a song
export const deleteSong = async (req, res) => {
  const song = await Song.findOne({ _id: req.params.id, user: req.user.id });
  if (!song) return res.status(404).json({ message: 'Song not found' });

  await song.deleteOne();
  res.json({ message: 'Song deleted' });
};

// ✅ Get all songs by user
export const getMySongs = async (req, res) => {
  const songs = await Song.find({ user: req.user.id });
  res.json(songs);
};

// ✅ Update user role (admin only)
export const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: 'User role updated', user });
};
