/**
 * Admin Commands Handler
 * Special commands that only the admin (bot owner) can execute.
 * Triggered by sending specific keywords as the admin user.
 */

const memory = require('../services/memory');
const { getStats: getRateLimitStats } = require('../middleware/rateLimit');
const logger = require('../utils/logger');
const { config } = require('../config');

// Admin command definitions
const COMMANDS = {
  '/status': {
    description: 'Show bot status and stats',
    handler: handleStatus,
  },
  '/clear': {
    description: 'Clear conversation history for a user',
    usage: '/clear <phone_number>',
    handler: handleClear,
  },
  '/clearall': {
    description: 'Clear ALL conversation histories',
    handler: handleClearAll,
  },
  '/users': {
    description: 'List active users',
    handler: handleUsers,
  },
  '/help': {
    description: 'Show available admin commands',
    handler: handleHelp,
  },
  '/ping': {
    description: 'Check if bot is alive',
    handler: handlePing,
  },
  '/ratelimit': {
    description: 'Show rate limit stats',
    handler: handleRateLimit,
  },
};

/**
 * Check if a message is an admin command
 * @param {string} userId - Sender's phone number
 * @param {string} text - Message text
 * @returns {{ isCommand: boolean, response: string|null }}
 */
async function handleAdminCommand(userId, text) {
  // Only admin can use commands
  const isAdmin = isAdminUser(userId);
  const trimmed = text.trim().toLowerCase();

  // Check if it's a command
  const commandKey = Object.keys(COMMANDS).find(cmd => trimmed.startsWith(cmd));

  if (!commandKey) {
    return { isCommand: false, response: null };
  }

  if (!isAdmin) {
    logger.warn({ userId, command: commandKey }, 'Non-admin tried admin command');
    return { isCommand: true, response: null }; // Silently ignore
  }

  const command = COMMANDS[commandKey];
  const args = text.trim().slice(commandKey.length).trim();

  logger.info({ userId, command: commandKey, args }, 'Admin command executed');

  try {
    const response = await command.handler(args);
    return { isCommand: true, response };
  } catch (err) {
    logger.error({ err: err.message, command: commandKey }, 'Admin command failed');
    return { isCommand: true, response: `Error executing command: ${err.message}` };
  }
}

/**
 * Check if user is admin
 */
function isAdminUser(userId) {
  if (!config.adminPhone) return false;
  // Normalize phone numbers for comparison
  const normalizedUser = userId.replace(/[^0-9]/g, '');
  const normalizedAdmin = config.adminPhone.replace(/[^0-9]/g, '');
  return normalizedUser.includes(normalizedAdmin) || normalizedAdmin.includes(normalizedUser);
}

// Command handlers

async function handleStatus() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const memUsage = process.memoryUsage();

  const activeUsers = await memory.getActiveUsers();

  return [
    `🤖 Shy Bot Status`,
    ``,
    `Uptime: ${hours}h ${minutes}m`,
    `Active users: ${activeUsers.length}`,
    `Memory: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    `Node: ${process.version}`,
    `Environment: ${process.env.NODE_ENV || 'development'}`,
  ].join('\n');
}

async function handleClear(args) {
  if (!args) {
    return 'Usage: /clear <phone_number>\nExample: /clear 919876543210';
  }

  const userId = args.replace(/[^0-9]/g, '');
  await memory.clearHistory(userId);
  return `Cleared conversation history for ${userId}`;
}

async function handleClearAll() {
  const users = await memory.getActiveUsers();
  for (const user of users) {
    await memory.clearHistory(user);
  }
  return `Cleared conversation history for ${users.length} users`;
}

async function handleUsers() {
  const users = await memory.getActiveUsers();
  if (users.length === 0) {
    return 'No active users.';
  }
  const list = users.map((u, i) => `${i + 1}. ${u}`).join('\n');
  return `Active users (${users.length}):\n${list}`;
}

async function handleHelp() {
  const lines = ['🔧 Admin Commands:', ''];
  for (const [cmd, info] of Object.entries(COMMANDS)) {
    lines.push(`${cmd} — ${info.description}`);
  }
  return lines.join('\n');
}

async function handlePing() {
  return `Pong! Bot is alive. Response time: ${Date.now()}ms`;
}

async function handleRateLimit() {
  const stats = getRateLimitStats();
  if (stats.trackedUsers === 0) {
    return 'No rate-limited users currently.';
  }
  const lines = [`Rate limit stats (${stats.trackedUsers} tracked):`, ''];
  for (const entry of stats.entries.slice(0, 10)) {
    const age = Math.round(entry.windowAge / 1000);
    lines.push(`${entry.userId}: ${entry.count} msgs (${age}s ago)`);
  }
  return lines.join('\n');
}

module.exports = { handleAdminCommand, isAdminUser, COMMANDS };
