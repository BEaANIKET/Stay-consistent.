const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const { getTodayDateString } = require('../utils/dateUtils');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, isActive: true });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, type, required } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }
    if (!['positive', 'negative'].includes(type)) {
      return res.status(400).json({ message: 'Type must be positive or negative' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      type,
      required: required !== undefined ? required : true
    });

    // Add task to today's log if it exists
    const today = getTodayDateString();
    const log = await DailyLog.findOne({ userId: req.user._id, date: today });
    if (log) {
      log.tasks.push({ taskId: task._id, status: 'pending' });
      await log.save();
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

    const { title, type, required } = req.body;
    if (title) task.title = title;
    if (type) task.type = type;
    if (required !== undefined) task.required = required;

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
