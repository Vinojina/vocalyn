import express from 'express';
import { purchaseSong } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { makePayment } from '../controllers/paymentController.js';


const router = express.Router();

router.post('/purchase', protect, purchaseSong);
router.post('/song-payment', makePayment);

export default router;
