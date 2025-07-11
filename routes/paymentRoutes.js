import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import {
  purchaseSong,
  makePayment,
  getPayments,
  getPaymentStats
} from '../controllers/paymentController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// ✅ Stripe Checkout route for frontend use
router.post('/create-checkout-session', async (req, res) => {
  const { songId } = req.body;
  if (!songId) {
    return res.status(400).json({ error: 'Missing songId' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 999,
            product_data: {
              name: 'Premium Song Access',
              description: `Access to song ${songId}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?songId=${songId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

// Existing routes
router.post('/purchase', protect, purchaseSong);
router.post('/process', protect, makePayment);
router.get('/history', protect, isAdmin, getPayments);
router.get('/stats', protect, isAdmin, getPaymentStats);

export default router;
