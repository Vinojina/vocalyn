import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  score: { type: Number },
  feedback: { type: String },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
