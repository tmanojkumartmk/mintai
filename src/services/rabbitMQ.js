const amqp = require('amqplib');
require('dotenv').config();

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queue = process.env.RABBITMQ_QUEUE;
    this.connectionURL = this.buildConnectionURL();
  }

  buildConnectionURL() {
    return `amqps://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}/${process.env.RABBITMQ_VHOST}`;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.connectionURL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, {
        durable: true
      });
      return this.channel;
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }

  getChannel() {
    if (!this.channel) {
      throw new Error('RabbitMQ not connected');
    }
    return this.channel;
  }
}

module.exports = new RabbitMQService();
