
const express = require('express');
const router = express.Router();
const { subscribePro, stripeWebhook, getSubscriptionStatus } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/subscribe/pro', authMiddleware, subscribePro);
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
router.get('/subscription/status', authMiddleware, getSubscriptionStatus);

module.exports = router;
