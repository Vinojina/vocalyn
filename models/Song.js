import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  isPremium: { type: Boolean, default: false },
});

const Song = mongoose.model('Song', songSchema);
export default Song;
