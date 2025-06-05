import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/adminController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes and allow only admins
router.use(protect);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

export default router;
