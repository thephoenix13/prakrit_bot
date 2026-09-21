/**
 * Conversation Memory Manager
 * Stores per-user conversation history with TTL expiry.
 * Supports Redis (production) or in-memory node-cache (development).
 */

const NodeCache = require('node-cache');
const { config } = require('../config');
const logger = require('./logger');

let redisClient = null;
let memoryCache = null;

/**
 * Initialize the memory backend
 */
async function init() {
  if (config.redisUrl) {
    try {
      const redis = require('redis');
      redisClient = redis.createClient({ url: config.redisUrl });
      redisClient.on('error', (err) => logger.error({ err }, 'Redis error'));
      await redisClient.connect();
      logger.info('Connected to Redis for conversation memory');
      return;
    } catch (err) {
      logger.warn({ err }, 'Redis connection failed, falling back to in-memory cache');
      redisClient = null;
    }
  }

  // In-memory fallback
  memoryCache = new NodeCache({
    stdTTL: config.conversationTTLHours * 3600,
    checkperiod: 600, // Check for expired keys every 10 min
    useClones: false,
  });
  logger.info('Using in-memory cache for conversation memory');
}

/**
 * Get conversation history for a user
 * @param {string} userId - Phone number / chat ID
 * @returns {Array<{role: string, content: string}>}
 */
async function getHistory(userId) {
  try {
    if (redisClient) {
      const data = await redisClient.get(`chat:${userId}`);
      return data ? JSON.parse(data) : [];
    }
    return memoryCache.get(`chat:${userId}`) || [];
  } catch (err) {
    logger.error({ err, userId }, 'Error fetching conversation history');
    return [];
  }
}

/**
 * Add a message to conversation history
 * @param {string} userId
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content
 */
async function addMessage(userId, role, content) {
  try {
    const history = await getHistory(userId);
    history.push({ role, content });

    // Keep only last N messages (sliding window)
    const trimmed = history.slice(-config.maxHistory);

    if (redisClient) {
      await redisClient.set(
        `chat:${userId}`,
        JSON.stringify(trimmed),
        { EX: config.conversationTTLHours * 3600 }
      );
    } else {
      memoryCache.set(`chat:${userId}`, trimmed);
    }
  } catch (err) {
    logger.error({ err, userId }, 'Error saving conversation history');
  }
}

/**
 * Clear conversation history for a user
 */
async function clearHistory(userId) {
  try {
    if (redisClient) {
      await redisClient.del(`chat:${userId}`);
    } else {
      memoryCache.del(`chat:${userId}`);
    }
    logger.info({ userId }, 'Conversation history cleared');
  } catch (err) {
    logger.error({ err, userId }, 'Error clearing conversation history');
  }
}

/**
 * Get all active user IDs (for dashboard/monitoring)
 */
async function getActiveUsers() {
  try {
    if (redisClient) {
      const keys = await redisClient.keys('chat:*');
      return keys.map(k => k.replace('chat:', ''));
    }
    return memoryCache.keys().map(k => k.replace('chat:', ''));
  } catch (err) {
    logger.error({ err }, 'Error fetching active users');
    return [];
  }
}

module.exports = { init, getHistory, addMessage, clearHistory, getActiveUsers };
