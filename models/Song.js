import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  lyrics: {
    type: String
  },
  genre: {
    type: String
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  }
}, {
  timestamps: true
});

const Song = mongoose.model('Song', songSchema);

export default Song;
