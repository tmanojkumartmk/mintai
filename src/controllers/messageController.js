const { Message, Chatroom } = require('../models');
const rabbitMQ = require('../services/rabbitMQ');

class MessageController {
  async create(req, res) {
    const startTime = Date.now();
    console.log('[API] Starting message creation...');

    try {
      const { id: chatroomId } = req.params;
      const { message: userMessage } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!userMessage?.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('[API] Verifying chatroom access...');
      const chatroom = await Chatroom.findOne({
        where: { id: chatroomId, userId }
      });

      if (!chatroom) {
        return res.status(404).json({ error: 'Chatroom not found' });
      }

      console.log('[API] Saving message to database...');
      const newMessage = await Message.create({
        chatroomId,
        userMessage: userMessage.trim()
      });

      console.log('[API] Publishing to RabbitMQ...');
      const channel = rabbitMQ.getChannel();
      channel.sendToQueue(
        process.env.RABBITMQ_QUEUE,
        Buffer.from(JSON.stringify({
          messageId: newMessage.id,
          chatroomId,
          userMessage: newMessage.userMessage
        }))
      );

      const processingTime = Date.now() - startTime;
      console.log(`[API] Message flow completed in ${processingTime}ms`);

      res.status(201).json({
        message: 'Message sent successfully',
        data: {
          id: newMessage.id,
          userMessage: newMessage.userMessage,
          timestamp: newMessage.timestamp
        }
      });

    } catch (error) {
      console.error('[API] Message creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMessagesByChatroom(req, res) {
    try {
      const { id: chatroomId } = req.params;
      const userId = req.user.id;

      // Verify chatroom ownership
      const chatroom = await Chatroom.findOne({
        where: { id: chatroomId, userId }
      });

      if (!chatroom) {
        return res.status(404).json({ error: 'Chatroom not found' });
      }

      // Fetch messages
      const messages = await Message.findAll({
        where: { chatroomId },
        attributes: ['id', 'userMessage', 'geminiResponse', 'timestamp'],
        order: [['timestamp', 'DESC']]
      });

      res.json({
        chatroomId,
        messages: messages.map(msg => ({
          id: msg.id,
          userMessage: msg.userMessage,
          geminiResponse: msg.geminiResponse,
          timestamp: msg.timestamp
        }))
      });

    } catch (error) {
      console.error('Message fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MessageController();
