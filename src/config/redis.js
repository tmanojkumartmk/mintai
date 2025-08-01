const { createClient } = require('redis');
require('dotenv').config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

let redisClient;

if (isTestEnvironment) {
  console.log('Using mock Redis client for testing');

  // Simple in-memory cache for tests
  const cache = new Map();

  redisClient = {
    async connect() {
      return Promise.resolve();
    },

    async get(key) {
      return cache.get(key);
    },

    async setEx(key, ttl, value) {
      cache.set(key, value);
      return Promise.resolve('OK');
    },

    async del(key) {
      cache.delete(key);
      return Promise.resolve(1);
    }
  };
} else {
  const redisConfig = {
    url: process.env.REDIS_URL,
    socket: {
      tls: true
    }
  };

  redisClient = createClient(redisConfig);

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  // Connect to Redis when this module is imported
  (async () => {
    try {
      await redisClient.connect();
      console.log('Redis client connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  })();
}

module.exports = redisClient;
