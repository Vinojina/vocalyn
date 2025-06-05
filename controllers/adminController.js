// controllers/adminController.js

import User from '../models/User.js';

// @desc   Get all users (Admin only)
// @route  GET /api/admin/users
// @access Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc   Delete a user by ID (Admin only)
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// @desc   Update user role (Admin only)
// @route  PUT /api/admin/users/:id/role
// @access Private/Admin
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
