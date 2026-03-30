const User = require('../models/User');
const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const { getTodayDateString } = require('../utils/dateUtils');

const sendFriendRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const target = await User.findOne({ email });

    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself' });
    }
    if (req.user.friends.includes(target._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }
    if (target.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    target.friendRequests.push(req.user._id);
    await target.save();

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.friendRequests.includes(userId)) {
      return res.status(400).json({ message: 'No request from this user' });
    }

    user.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
    await user.save();

    const friend = await User.findById(userId);
    friend.friends.push(req.user._id);
    await friend.save();

    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email disciplineScore');
    const today = getTodayDateString();

    const friendsData = await Promise.all(user.friends.map(async (friend) => {
      const tasks = await Task.find({ userId: friend._id, isActive: true });
      const todayLog = await DailyLog.findOne({ userId: friend._id, date: today });

      const maxStreak = tasks.reduce((max, t) => Math.max(max, t.currentStreak), 0);
      const longestStreak = tasks.reduce((max, t) => Math.max(max, t.longestStreak), 0);

      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        disciplineScore: friend.disciplineScore,
        currentStreak: maxStreak,
        longestStreak,
        todayStatus: todayLog ? todayLog.dayStatus : 'no-data'
      };
    }));

    const requests = await User.find({ _id: { $in: user.friendRequests } }, 'name email');
    res.json({ friends: friendsData, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendFriendRequest, acceptFriendRequest, getFriends };
