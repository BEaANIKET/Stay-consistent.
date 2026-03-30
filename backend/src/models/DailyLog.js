const mongoose = require('mongoose');

const taskLogSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: String, enum: ['pending', 'done', 'failed'], default: 'pending' },
  markedAt: { type: Date }
});

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  tasks: [taskLogSchema],
  score: { type: Number, default: 0 },
  dayStatus: { type: String, enum: ['pending', 'completed', 'failed', 'partial'], default: 'pending' },
  autoFailed: { type: Boolean, default: false }
}, { timestamps: true });

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
