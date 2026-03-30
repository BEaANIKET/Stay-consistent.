import api from './axios';

export const getFriends = () => api.get('/friends');
export const sendFriendRequest = (email) => api.post('/friends/request', { email });
export const acceptFriendRequest = (userId) => api.post('/friends/accept', { userId });
