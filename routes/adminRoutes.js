import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';
import { isAdmin } from '../middlewares/authMiddleware.js';
import Song from '../models/Song.js';

const router = express.Router();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role){
      return res.status(403).json({error:'forbidden'});
  }
  next();
  }
};

router.get('/users',protect, getAllUsers);
router.put('/users/:id/role', protect, checkRole('admin'), updateUserRole);
router.get('/users/:id', protect, getUserById);

router.get('/all-songs', protect, isAdmin, async (req, res) => {
  try {
    const songs = await Song.find({});
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ${userId} updated`);
});

import {
  getAllUsers,
  updateUserRole,
  getUserById,
} from '../controllers/adminController.js';
export default router;
