import api from './axios';

export const getWeeklyReport = () => api.get('/reports/weekly');
export const getMonthlyReport = () => api.get('/reports/monthly');
