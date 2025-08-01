const express = require('express');
const chatroomController = require('../controllers/chatroomController');
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/authMiddleware');
const checkMessageLimit = require('../middleware/rateLimit');

const router = express.Router();

/**
 * Create a new chatroom
 * POST /chatroom
 * Requires authentication
 */
router.post('/', authenticateToken, chatroomController.create.bind(chatroomController));

/**
 * List all chatrooms for the authenticated user
 * GET /chatroom
 * Requires authentication
 */
router.get('/', authenticateToken, chatroomController.list.bind(chatroomController));

/**
 * Get specific chatroom by ID
 * GET /chatroom/:id
 * Requires authentication
 */
router.get('/:id', authenticateToken, chatroomController.getById.bind(chatroomController));

/**
 * Send a message in a chatroom
 * POST /chatroom/:id/message
 * Requires authentication
 */
router.post('/:id/message', authenticateToken, checkMessageLimit, messageController.create.bind(messageController));

/**
 * Get all messages in a chatroom
 * GET /chatroom/:id/messages
 * Requires authentication
 */
router.get('/:id/messages', authenticateToken, messageController.getMessagesByChatroom.bind(messageController));

module.exports = router;
