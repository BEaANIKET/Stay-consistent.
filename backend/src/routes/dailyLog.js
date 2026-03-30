const express = require('express');
const router = express.Router();
const { getTodayLog, markTask } = require('../controllers/dailyLogController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/today', getTodayLog);
router.post('/mark', markTask);

module.exports = router;
