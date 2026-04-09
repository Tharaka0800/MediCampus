import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  queueNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'done', 'emergency'],
    default: 'waiting',
  },
  estimatedTime: {
    type: Number, // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Queue', queueSchema);