const express = require('express');
const router = express.Router();
const { getWeeklyReport, getMonthlyReport } = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);

module.exports = router;
