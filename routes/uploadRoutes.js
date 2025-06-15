import express from 'express';
import upload from '../middlewares/upload.js'; // multer config
import { uploadSong } from '../controllers/songController.js';

const router = express.Router();

router.post('/upload', upload.single('audio'), uploadSong);

export default router;
