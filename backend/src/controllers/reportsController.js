const DailyLog = require('../models/DailyLog');
const { getPastDays } = require('../utils/dateUtils');

const getWeeklyReport = async (req, res) => {
  try {
    const days = getPastDays(7);
    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $in: days }
    }).populate('tasks.taskId');

    const report = days.map(date => {
      const log = logs.find(l => l.date === date);
      if (!log) return { date, status: 'no-data', completionRate: 0, score: 0, tasks: [] };

      const total = log.tasks.length;
      const done = log.tasks.filter(t => t.status === 'done').length;
      const failed = log.tasks.filter(t => t.status === 'failed').length;
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        date,
        status: log.dayStatus,
        completionRate,
        score: log.score,
        tasks: log.tasks,
        autoFailed: log.autoFailed
      };
    });

    const totalDays = report.filter(d => d.status !== 'no-data').length;
    const completedDays = report.filter(d => d.status === 'completed').length;
    const failedDays = report.filter(d => d.status === 'failed').length;
    const overallConsistency = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    const failureRate = totalDays > 0 ? Math.round((failedDays / totalDays) * 100) : 0;

    res.json({ report, overallConsistency, failureRate, period: '7d' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const days = getPastDays(30);
    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $in: days }
    }).populate('tasks.taskId');

    const report = days.map(date => {
      const log = logs.find(l => l.date === date);
      if (!log) return { date, status: 'no-data', completionRate: 0, score: 0 };

      const total = log.tasks.length;
      const done = log.tasks.filter(t => t.status === 'done').length;
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        date,
        status: log.dayStatus,
        completionRate,
        score: log.score,
        autoFailed: log.autoFailed
      };
    });

    const totalDays = report.filter(d => d.status !== 'no-data').length;
    const completedDays = report.filter(d => d.status === 'completed').length;
    const failedDays = report.filter(d => d.status === 'failed' || d.status === 'partial').length;
    const overallConsistency = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    const failureRate = totalDays > 0 ? Math.round((failedDays / totalDays) * 100) : 0;

    const weeklyBreakdown = [];
    for (let i = 0; i < 4; i++) {
      const weekDays = report.slice(i * 7, (i + 1) * 7);
      const weekCompleted = weekDays.filter(d => d.status === 'completed').length;
      const weekTotal = weekDays.filter(d => d.status !== 'no-data').length;
      weeklyBreakdown.push({
        week: i + 1,
        completionRate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      });
    }

    res.json({ report, overallConsistency, failureRate, weeklyBreakdown, period: '30d' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWeeklyReport, getMonthlyReport };
