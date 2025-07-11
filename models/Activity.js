import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
