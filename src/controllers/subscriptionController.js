
const { User } = require('../models');
const { createCheckoutSession } = require('../services/stripe');

const subscribePro = async (req, res) => {
  try {
    const user = req.user;
    const priceId = process.env.STRIPE_PRICE_ID;

    const session = await createCheckoutSession(user, priceId);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const user = await User.findOne({ where: { email: session.customer_email } });

    if (user) {
      user.subscriptionTier = 'Pro';
      await user.save();
    }
  }

  res.status(200).json({ received: true });
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ subscription: user.subscriptionTier || 'Basic' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subscribePro,
  stripeWebhook,
  getSubscriptionStatus,
};
