import express from 'express';
import { loginUser, registerUser,getUserProfile,
    verifyToken
} from '../controllers/authController.js';
import { protect } from './adminRoutes.js';

const router = express.Router();

router.get('/verify', verifyToken);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getUserProfile); 

export default router;
