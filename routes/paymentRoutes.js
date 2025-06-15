import express from 'express';
import { purchaseSong } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { makePayment } from '../controllers/paymentController.js'; // Assuming you have a dummy payment controller


const router = express.Router();

router.post('/purchase', protect, purchaseSong);
router.post('/dummy-payment', makePayment); // Dummy payment route

export default router;
