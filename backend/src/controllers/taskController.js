const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const { getTodayDateString, isTaskActiveOnDate } = require('../utils/dateUtils');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, isActive: true });

    // Optional: ?date=YYYY-MM-DD  →  return only tasks active on that date
    const { date } = req.query;
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'date must be YYYY-MM-DD' });
      }
      return res.json({ tasks: tasks.filter(t => isTaskActiveOnDate(t, date)) });
    }

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, type, required, scheduleType, daysOfWeek, startDate, endDate, availableFrom } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }
    if (!['positive', 'negative'].includes(type)) {
      return res.status(400).json({ message: 'Type must be positive or negative' });
    }

    const validScheduleTypes = ['daily', 'weekly', 'custom', 'one-time'];
    const resolvedScheduleType = scheduleType || 'daily';
    if (!validScheduleTypes.includes(resolvedScheduleType)) {
      return res.status(400).json({ message: 'Invalid scheduleType' });
    }

    if (daysOfWeek && daysOfWeek.some(d => d < 0 || d > 6)) {
      return res.status(400).json({ message: 'daysOfWeek values must be 0–6' });
    }

    // Validate HH:MM format if provided
    if (availableFrom && !/^\d{2}:\d{2}$/.test(availableFrom)) {
      return res.status(400).json({ message: 'availableFrom must be HH:MM format' });
    }

    const today = getTodayDateString();

    const task = await Task.create({
      userId:        req.user._id,
      title,
      type,
      required:      required !== undefined ? required : true,
      scheduleType:  resolvedScheduleType,
      daysOfWeek:    daysOfWeek    || [],
      startDate:     startDate     || today,
      endDate:       endDate       || null,
      availableFrom: availableFrom || null,
    });

    // Add to today's log only if the task is active today
    if (isTaskActiveOnDate(task, today)) {
      const log = await DailyLog.findOne({ userId: req.user._id, date: today });
      if (log) {
        log.tasks.push({ taskId: task._id, status: 'pending' });
        await log.save();
      }
    }

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, type, required, scheduleType, daysOfWeek, startDate, endDate, excludedDates, availableFrom } = req.body;

    if (title    !== undefined) task.title    = title;
    if (type     !== undefined) task.type     = type;
    if (required !== undefined) task.required = required;

    if (scheduleType  !== undefined) task.scheduleType  = scheduleType;
    if (daysOfWeek    !== undefined) task.daysOfWeek    = daysOfWeek;
    if (startDate     !== undefined) task.startDate     = startDate    || null;
    if (endDate       !== undefined) task.endDate       = endDate      || null;
    if (excludedDates !== undefined) task.excludedDates = excludedDates;

    if (availableFrom !== undefined) {
      if (availableFrom && !/^\d{2}:\d{2}$/.test(availableFrom)) {
        return res.status(400).json({ message: 'availableFrom must be HH:MM format' });
      }
      task.availableFrom = availableFrom || null;
    }

    await task.save();
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isActive = false;
    await task.save();
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
