require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/daily-log', require('./routes/dailyLog'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/friends', require('./routes/friends'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Midnight cron: auto-fail pending tasks from previous days
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running midnight auto-fail job...');
  try {
    const User = require('./models/User');
    const { autoFailPendingTasks } = require('./controllers/dailyLogController');
    const users = await User.find({});
    for (const user of users) {
      await autoFailPendingTasks(user._id);
    }
    console.log('[CRON] Auto-fail complete.');
  } catch (err) {
    console.error('[CRON] Error:', err.message);
  }
});

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/disciplineos')
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
