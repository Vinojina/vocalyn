// routes/userRoutes.js

import express from 'express';
const router = express.Router();
import {
  getUserById,
  updateUserById,
  deleteUserById,
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { adminOnlyController } from '../controllers/adminController.js';

// Admin-only user operations
router.route('/:id')
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUserById)
 .delete(protect, isAdmin, deleteUserById);
  router.get('/admin-data', protect, isAdmin, adminOnlyController);


export default router;
