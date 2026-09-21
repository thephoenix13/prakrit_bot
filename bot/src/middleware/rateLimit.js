/**
 * Rate Limiter
 * Prevents abuse — limits messages per user per time window.
 * Uses in-memory store (no Redis dependency for rate limiting).
 */

const logger = require('../utils/logger');

// In-memory rate limit store
const rateLimitStore = new Map();

// Cleanup interval — remove expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > data.windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a user is rate limited
 * @param {string} userId - User identifier
 * @param {object} options
 * @param {number} options.maxRequests - Max requests per window (default: 20)
 * @param {number} options.windowMs - Window in milliseconds (default: 60000 = 1 min)
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
function checkRateLimit(userId, options = {}) {
  const maxRequests = options.maxRequests || 20;
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const now = Date.now();
  const key = `rl:${userId}`;

  let data = rateLimitStore.get(key);

  if (!data || now - data.windowStart > windowMs) {
    // New window
    data = {
      count: 1,
      windowStart: now,
      windowMs,
    };
    rateLimitStore.set(key, data);
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  data.count++;

  if (data.count > maxRequests) {
    const retryAfterMs = windowMs - (now - data.windowStart);
    logger.warn({ userId, count: data.count, maxRequests }, 'Rate limit exceeded');
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  return { allowed: true, remaining: maxRequests - data.count, retryAfterMs: 0 };
}

/**
 * Get a human-readable rate limit message
 */
function getRateLimitMessage(retryAfterMs) {
  const seconds = Math.ceil(retryAfterMs / 1000);
  if (seconds < 60) {
    return `I'm getting a lot of messages! Please wait ${seconds} seconds before sending another one.`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `I'm getting a lot of messages! Please wait ${minutes} minute(s) before sending another one.`;
}

/**
 * Get current rate limit stats (for monitoring)
 */
function getStats() {
  return {
    trackedUsers: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, data]) => ({
      userId: key.replace('rl:', ''),
      count: data.count,
      windowAge: Date.now() - data.windowStart,
    })),
  };
}

module.exports = { checkRateLimit, getRateLimitMessage, getStats };
