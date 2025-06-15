// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';

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

export const isAdmin = (req, res, next) => {
  console.log('✅ isAdmin middleware is active');
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
router.get('/users', getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
router.get('/users/:id', protect, isAdmin, getUserById);

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ${userId} updated`);
});




import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getUserById,
} from '../controllers/adminController.js';
export default router;

