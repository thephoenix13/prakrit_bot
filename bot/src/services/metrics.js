/**
 * Metrics Collector
 * Tracks bot performance metrics for monitoring and dashboard.
 */

const logger = require('./logger');

// In-memory metrics store
const metrics = {
  // Counters
  totalMessages: 0,
  textMessages: 0,
  voiceMessages: 0,
  documentMessages: 0,
  imageMessages: 0,
  errors: 0,
  rateLimits: 0,
  adminCommands: 0,

  // Timing (last N)
  responseTimes: [],
  maxResponseTimeHistory: 100,

  // Per-type timing
  avgResponseTime: 0,
  p95ResponseTime: 0,
  p99ResponseTime: 0,

  // Session
  startTime: Date.now(),
  lastMessageTime: null,
};

/**
 * Record a message was processed
 */
function recordMessage(type, responseTimeMs) {
  metrics.totalMessages++;
  metrics.lastMessageTime = Date.now();

  switch (type) {
    case 'text': metrics.textMessages++; break;
    case 'voice': metrics.voiceMessages++; break;
    case 'document': metrics.documentMessages++; break;
    case 'image': metrics.imageMessages++; break;
  }

  if (responseTimeMs > 0) {
    metrics.responseTimes.push(responseTimeMs);
    if (metrics.responseTimes.length > metrics.maxResponseTimeHistory) {
      metrics.responseTimes.shift();
    }
    recalculateTiming();
  }
}

/**
 * Record an error
 */
function recordError() {
  metrics.errors++;
}

/**
 * Record a rate limit hit
 */
function recordRateLimit() {
  metrics.rateLimits++;
}

/**
 * Record an admin command
 */
function recordAdminCommand() {
  metrics.adminCommands++;
}

/**
 * Recalculate timing percentiles
 */
function recalculateTiming() {
  if (metrics.responseTimes.length === 0) return;

  const sorted = [...metrics.responseTimes].sort((a, b) => a - b);
  metrics.avgResponseTime = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
  metrics.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)] || 0;
  metrics.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)] || 0;
}

/**
 * Get all metrics
 */
function getMetrics() {
  const uptime = Date.now() - metrics.startTime;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

  return {
    ...metrics,
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    uptimeMs: uptime,
    messagesPerHour: metrics.totalMessages > 0
      ? Math.round(metrics.totalMessages / (uptime / (1000 * 60 * 60)))
      : 0,
  };
}

/**
 * Get metrics as a formatted string (for admin commands)
 */
function getMetricsString() {
  const m = getMetrics();
  return [
    `📊 Bot Metrics`,
    ``,
    `Uptime: ${m.uptime}`,
    `Total messages: ${m.totalMessages}`,
    `  Text: ${m.textMessages}`,
    `  Voice: ${m.voiceMessages}`,
    `  Documents: ${m.documentMessages}`,
    `  Images: ${m.imageMessages}`,
    ``,
    `Response time (avg): ${m.avgResponseTime}ms`,
    `Response time (p95): ${m.p95ResponseTime}ms`,
    `Response time (p99): ${m.p99ResponseTime}ms`,
    ``,
    `Errors: ${m.errors}`,
    `Rate limits: ${m.rateLimits}`,
    `Admin commands: ${m.adminCommands}`,
    `Messages/hour: ${m.messagesPerHour}`,
  ].join('\n');
}

/**
 * Reset all metrics
 */
function resetMetrics() {
  metrics.totalMessages = 0;
  metrics.textMessages = 0;
  metrics.voiceMessages = 0;
  metrics.documentMessages = 0;
  metrics.imageMessages = 0;
  metrics.errors = 0;
  metrics.rateLimits = 0;
  metrics.adminCommands = 0;
  metrics.responseTimes = [];
  metrics.avgResponseTime = 0;
  metrics.p95ResponseTime = 0;
  metrics.p99ResponseTime = 0;
  metrics.startTime = Date.now();
  metrics.lastMessageTime = null;
  logger.info('Metrics reset');
}

module.exports = {
  recordMessage,
  recordError,
  recordRateLimit,
  recordAdminCommand,
  getMetrics,
  getMetricsString,
  resetMetrics,
};
