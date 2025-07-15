import mongoose from 'mongoose';

// Add user field to Song model
const songSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
