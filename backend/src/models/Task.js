const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:         { type: String, required: true, trim: true },
  type:          { type: String, enum: ['positive', 'negative'], required: true },
  required:      { type: Boolean, default: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  relapseCount:  { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },

  // Recurrence
  scheduleType:  {
    type:    String,
    enum:    ['daily', 'weekly', 'custom', 'one-time'],
    default: 'daily',
  },
  // 0 = Sun … 6 = Sat. Empty means "every day" (used with scheduleType 'daily')
  daysOfWeek:    [{ type: Number, min: 0, max: 6 }],
  // YYYY-MM-DD — first day this task is active (also the date for one-time tasks)
  startDate:     { type: String, default: null },
  // YYYY-MM-DD — last day (null = infinite)
  endDate:       { type: String, default: null },
  // YYYY-MM-DD strings for individual days to skip
  excludedDates: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
