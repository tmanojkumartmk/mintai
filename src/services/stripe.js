const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (user, priceId) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    customer_email: user.email,
  });

  return session;
};

module.exports = {
  createCheckoutSession,
};
