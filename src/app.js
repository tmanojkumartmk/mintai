const express = require('express');
const authRoutes = require('./routes/auth');
const chatroomRoutes = require('./routes/chatroom');
const subscriptionRoutes = require('./routes/subscription');
const rabbitMQ = require('./services/rabbitMQ');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Connect to RabbitMQ (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  rabbitMQ.connect().catch(err => {
    console.error('Failed to connect to RabbitMQ:', err);
  });
}

// Routes
app.use('/auth', authRoutes);
app.use('/chatroom', chatroomRoutes);
app.use('/', subscriptionRoutes);

module.exports = app;
