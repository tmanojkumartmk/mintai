const { Message } = require('../models');
const rabbitMQ = require('../services/rabbitMQ');
const geminiService = require('../services/gemini');

class MessageConsumer {
  async start() {
    try {
      console.log('[Consumer] Starting message consumer...');
      const channel = await rabbitMQ.getChannel();

      console.log('[Consumer] Connected to RabbitMQ, waiting for messages...');

      channel.consume(process.env.RABBITMQ_QUEUE, async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());
          console.log('[Consumer] Received message:', {
            messageId: data.messageId,
            userMessage: data.userMessage?.substring(0, 50) + '...'
          });

          console.log('[Consumer] Requesting AI response...');
          const aiResponse = await geminiService.generateResponse(data.userMessage);
          console.log('[Consumer] Received AI response:', {
            messageId: data.messageId,
            responseLength: aiResponse?.length || 0
          });

          console.log('[Consumer] Updating database...');
          await Message.update(
            { geminiResponse: aiResponse },
            { where: { id: data.messageId } }
          );

          channel.ack(msg);
          console.log('[Consumer] ✓ Message processing complete:', {
            messageId: data.messageId
          });

        } catch (error) {
          console.error('[Consumer] Processing error:', {
            error: error.message,
            stack: error.stack
          });
          channel.nack(msg, false, true);
        }
      }, {
        noAck: false
      });

    } catch (error) {
      console.error('[Consumer] Startup error:', error);
      throw error;
    }
  }
}

module.exports = new MessageConsumer();
