import api from './axios';

export const getTodayLog = () => api.get('/daily-log/today');
export const markTask = (data) => api.post('/daily-log/mark', data);
