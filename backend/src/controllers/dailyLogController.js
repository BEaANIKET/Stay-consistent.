const DailyLog = require('../models/DailyLog');
const Task = require('../models/Task');
const User = require('../models/User');
const { getTodayDateString } = require('../utils/dateUtils');

const POINTS_COMPLETE = 5;
const POINTS_FAIL = -10;

// Ensure today's log exists for user
const ensureTodayLog = async (userId) => {
  const today = getTodayDateString();
  let log = await DailyLog.findOne({ userId, date: today });

  if (!log) {
    const tasks = await Task.find({ userId, isActive: true });
    const taskEntries = tasks.map(t => ({ taskId: t._id, status: 'pending' }));
    log = await DailyLog.create({ userId, date: today, tasks: taskEntries });
  }

  return log;
};

const getTodayLog = async (req, res) => {
  try {
    const log = await ensureTodayLog(req.user._id);
    const populated = await DailyLog.findById(log._id).populate('tasks.taskId');
    res.json({ log: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markTask = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ message: 'taskId and status are required' });
    }
    if (!['done', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be done or failed' });
    }

    const today = getTodayDateString();
    const log = await ensureTodayLog(req.user._id);

    const taskEntry = log.tasks.find(t => t.taskId.toString() === taskId);
    if (!taskEntry) {
      return res.status(404).json({ message: 'Task not found in today\'s log' });
    }

    // Strict mode: cannot re-mark a task
    if (taskEntry.status !== 'pending') {
      return res.status(403).json({ message: 'Task already marked. Cannot change.' });
    }

    taskEntry.status = status;
    taskEntry.markedAt = new Date();

    // Update task streak
    const task = await Task.findById(taskId);
    const user = await User.findById(req.user._id);

    if (status === 'done') {
      if (task.type === 'positive') {
        task.currentStreak += 1;
        if (task.currentStreak > task.longestStreak) {
          task.longestStreak = task.currentStreak;
        }
      } else {
        // negative habit: "done" means maintained (no relapse)
        task.currentStreak += 1;
        if (task.currentStreak > task.longestStreak) {
          task.longestStreak = task.currentStreak;
        }
      }
      log.score += POINTS_COMPLETE;
      user.disciplineScore += POINTS_COMPLETE;
    } else {
      // failed
      task.currentStreak = 0;
      if (task.type === 'negative') {
        task.relapseCount += 1;
      }
      log.score += POINTS_FAIL;
      user.disciplineScore += POINTS_FAIL;
    }

    // Update day status
    const allTasks = log.tasks;
    const pending = allTasks.filter(t => t.status === 'pending').length;
    const failed = allTasks.filter(t => t.status === 'failed').length;
    const done = allTasks.filter(t => t.status === 'done').length;

    if (pending === 0) {
      if (failed === 0) {
        log.dayStatus = 'completed';
      } else if (done === 0) {
        log.dayStatus = 'failed';
      } else {
        log.dayStatus = 'partial';
      }
    }

    await Promise.all([task.save(), user.save(), log.save()]);

    const populated = await DailyLog.findById(log._id).populate('tasks.taskId');
    res.json({
      log: populated,
      message: status === 'failed' ? 'You broke your discipline.' : 'Task completed. Keep going.',
      scoreChange: status === 'done' ? POINTS_COMPLETE : POINTS_FAIL
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Auto-fail all pending tasks for a given user's past days
const autoFailPendingTasks = async (userId) => {
  const today = getTodayDateString();
  const logs = await DailyLog.find({
    userId,
    date: { $lt: today },
    dayStatus: 'pending'
  });

  for (const log of logs) {
    let penaltyPoints = 0;
    for (const taskEntry of log.tasks) {
      if (taskEntry.status === 'pending') {
        taskEntry.status = 'failed';
        penaltyPoints += POINTS_FAIL;

        const task = await Task.findById(taskEntry.taskId);
        if (task) {
          task.currentStreak = 0;
          if (task.type === 'negative') task.relapseCount += 1;
          await task.save();
        }
      }
    }

    const failed = log.tasks.filter(t => t.status === 'failed').length;
    const done = log.tasks.filter(t => t.status === 'done').length;

    if (failed === 0) log.dayStatus = 'completed';
    else if (done === 0) log.dayStatus = 'failed';
    else log.dayStatus = 'partial';

    log.autoFailed = true;
    log.score += penaltyPoints;
    await log.save();

    if (penaltyPoints !== 0) {
      await User.findByIdAndUpdate(userId, { $inc: { disciplineScore: penaltyPoints } });
    }
  }
};

module.exports = { getTodayLog, markTask, autoFailPendingTasks, ensureTodayLog };
