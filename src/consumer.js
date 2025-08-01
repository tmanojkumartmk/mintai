require('dotenv').config();
const messageConsumer = require('./jobs/messageConsumer');
const { sequelize } = require('./models');
const rabbitMQ = require('./services/rabbitMQ');

async function checkPrerequisites() {
  try {
    // Check database connection
    await sequelize.authenticate();
    console.log('✓ Database connection verified');

    // Check RabbitMQ connection
    await rabbitMQ.connect();
    console.log('✓ RabbitMQ connection verified');

    return true;
  } catch (error) {
    console.error('Prerequisite check failed:', error);
    return false;
  }
}

async function startConsumer() {
  try {
    console.log('Checking system prerequisites...');
    const prerequisitesOk = await checkPrerequisites();

    if (!prerequisitesOk) {
      console.error('Failed to verify system prerequisites. Please check your setup.');
      process.exit(1);
    }

    console.log('Starting message consumer...');
    await messageConsumer.start();

    // Handle shutdown
    process.on('SIGTERM', async () => {
      console.log('Shutting down consumer...');
      await rabbitMQ.disconnect();
      await sequelize.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Consumer startup error:', error);
    process.exit(1);
  }
}

// Start the consumer
console.log('Initializing message consumer service...');
startConsumer();
