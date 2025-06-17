// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter: allow audio and text files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.mp3', '.wav', '.m4a', '.txt'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .mp3, .wav, .m4a or .txt files are allowed'), false);
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

// This accepts two fields: 'audio' and 'lyricsFile'
export const uploadFields = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'lyricsFile', maxCount: 1 },
]);

export default upload;
