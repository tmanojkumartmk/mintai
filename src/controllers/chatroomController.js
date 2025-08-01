const { Chatroom } = require('../models');
const redisClient = require('../config/redis');

class ChatroomController {
  async create(req, res) {
    try {
      const { title } = req.body;

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const chatroom = await Chatroom.create({
        userId: req.user.id,
        title: title.trim()
      });

      const cacheKey = `chatrooms:user:${req.user.id}`;
      await redisClient.del(cacheKey);

      res.status(201).json({
        message: 'Chatroom created successfully',
        chatroom: {
          id: chatroom.id,
          title: chatroom.title,
          createdAt: chatroom.createdAt,
          creator: {
            id: req.user.id,
            email: req.user.email
          }
        }
      });
    } catch (error) {
      console.error('Chatroom creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async list(req, res) {
    try {
      // Create a unique cache key based on the user ID
      const cacheKey = `chatrooms:user:${req.user.id}`;

      // Try to get data from Redis cache
      const cachedData = await redisClient.get(cacheKey);
      console.log(cachedData,'-------qq')
      if (cachedData) {
        // If cache hit, return the cached data
        console.log('Cache hit for chatrooms list');
        return res.json(JSON.parse(cachedData));
      }

      // If cache miss, fetch data from database
      console.log('Cache miss for chatrooms list, fetching from database');
      const chatrooms = await Chatroom.findAll({
        where: { userId: req.user.id },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'title', 'createdAt']
      });

      const responseData = { chatrooms };

      // Store the result in Redis with a 5-minute (300 seconds) TTL
      await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));

      res.json(responseData);
    } catch (error) {
      console.error('Chatroom fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const chatroom = await Chatroom.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        attributes: ['id', 'title', 'createdAt']
      });

      if (!chatroom) {
        return res.status(404).json({ error: 'Chatroom not found' });
      }

      res.json({ chatroom });
    } catch (error) {
      console.error('Chatroom fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ChatroomController();
