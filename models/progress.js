import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  completedSongs: [{ type: String }],
  levelUnlocked: {
    type: String,
    enum: ['locked', 'beginner', 'intermediate', 'advanced'],
    default: 'locked',
  },
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
