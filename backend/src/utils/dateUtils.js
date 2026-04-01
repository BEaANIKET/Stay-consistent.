const getTodayDateString = () => {
  const now = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day   = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateString = (date) => {
  const d     = new Date(date);
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPastDays = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getDateString(d));
  }
  return dates;
};

/**
 * Returns the local day-of-week (0=Sun … 6=Sat) for a YYYY-MM-DD string
 * without any UTC/timezone shift — safe on any server timezone.
 */
const getDayOfWeek = (dateString) => {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

/**
 * Determines whether a task should appear in the daily log for a given date.
 *
 * Rules:
 *   - isActive must be true
 *   - startDate (if set): date must be >= startDate
 *   - endDate   (if set): date must be <= endDate
 *   - excludedDates: date must not be in the list
 *   - scheduleType:
 *       'one-time'       → only on exact startDate
 *       'daily'          → every day (no daysOfWeek check)
 *       'weekly'/'custom'→ day-of-week must be in daysOfWeek
 *
 * Existing tasks without scheduleType default to 'daily' (backward-compatible).
 */
const isTaskActiveOnDate = (task, dateString) => {
  if (!task.isActive) return false;

  if (task.startDate && dateString < task.startDate) return false;
  if (task.endDate   && dateString > task.endDate)   return false;
  if (task.excludedDates && task.excludedDates.includes(dateString)) return false;

  const scheduleType = task.scheduleType || 'daily';

  if (scheduleType === 'one-time') {
    return task.startDate === dateString;
  }

  if (scheduleType === 'daily') return true;

  // 'weekly' or 'custom' — match against stored days
  if (task.daysOfWeek && task.daysOfWeek.length > 0) {
    return task.daysOfWeek.includes(getDayOfWeek(dateString));
  }

  // daysOfWeek empty on a weekly/custom task → treat as daily
  return true;
};

module.exports = { getTodayDateString, getDateString, getPastDays, getDayOfWeek, isTaskActiveOnDate };
