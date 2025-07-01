import express from 'express';
import {
  purchaseSong,
  makePayment,
  getPayments,
  getPaymentStats
} from '../controllers/paymentController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/purchase', protect, purchaseSong);
router.post('/process', protect, makePayment);

// Admin routes
router.get('/history', protect, isAdmin, getPayments);
router.get('/stats', protect, isAdmin, getPaymentStats);

export default router;