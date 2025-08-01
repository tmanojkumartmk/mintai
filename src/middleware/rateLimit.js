const {UserMessageCount } = require('../models');
const DAILY_MESSAGE_LIMIT = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

async function checkMessageLimit(req, res, next) {
  try {
    // Skip check for premium users
    if (req.user.subscriptionTier === 'premium') {
      return next();
    }

    // Get or create user's message count record
    let [messageCount] = await UserMessageCount.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        messageCount: 0,
        lastReset: new Date()
      }
    });

    // Check if we need to reset the daily count
    const now = new Date();
    const timeSinceReset = now - messageCount.lastReset;

    if (timeSinceReset >= MILLISECONDS_PER_DAY) {
      // Reset count if it's been more than 24 hours
      await messageCount.update({
        messageCount: 0,
        lastReset: now
      });
    }

    // Check if user has reached their daily limit
    if (messageCount.messageCount >= DAILY_MESSAGE_LIMIT) {
      return res.status(429).json({
        error: 'Daily message limit reached',
        limit: DAILY_MESSAGE_LIMIT,
        nextReset: new Date(messageCount.lastReset.getTime() + MILLISECONDS_PER_DAY)
      });
    }

    // Increment message count
    await messageCount.increment('messageCount');

    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = checkMessageLimit;
