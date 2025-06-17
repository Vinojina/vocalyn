import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  completedSongs: [
    {
      song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
      score: { type: Number },
      completedAt: { type: Date, default: Date.now }
    }
  ],
  levelUnlocked: {
    type: String,
    enum: ['locked', 'beginner', 'intermediate', 'advanced'],
    default: 'locked',
  }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
