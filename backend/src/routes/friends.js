const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, getFriends } = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFriends);
router.post('/request', sendFriendRequest);
router.post('/accept', acceptFriendRequest);

module.exports = router;
