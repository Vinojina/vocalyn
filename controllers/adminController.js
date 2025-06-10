// controllers/adminController.js

import User from '../models/User.js';

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
    console.log('🧨 Deleting user ID:', req.params.id); // Log ID

    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    console.log('✅ User deleted successfully');
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('🔥 Error deleting user:', error.message); // Print actual error
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
export const adminOnlyController = (req, res, next) => {
  // Middleware to check if the user is an admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
}
// @desc   Get a user by ID (Admin only)
// @route  GET /api/admin/users/:id
// @access Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error.message); // 👈 log it!
    res.status(500).json({ message: 'Server error' });
  }
};
