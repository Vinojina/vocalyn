import express from 'express';
import { getLyrics } from '../controllers/lyricsController.js';

const router = express.Router();

router.get('/:songFile', getLyrics); // this uses the controller, not middleware

export default router;
