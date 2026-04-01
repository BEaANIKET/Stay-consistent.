import api from './axios';

// date (optional YYYY-MM-DD): if supplied, returns only tasks active on that day
export const getTasks = (date) =>
  api.get('/tasks', { params: date ? { date } : undefined });

export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
