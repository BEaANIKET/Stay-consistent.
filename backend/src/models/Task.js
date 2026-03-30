const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['positive', 'negative'], required: true },
  required: { type: Boolean, default: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  relapseCount: { type: Number, default: 0 }, // for negative habits
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
