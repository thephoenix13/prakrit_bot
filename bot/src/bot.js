/**
 * Shy Bot — Main Entry Point
 * Prakrit AI WhatsApp Healthcare Assistant
 *
 * This file:
 * 1. Initializes OpenWA (WhatsApp Web client)
 * 2. Sets up conversation memory
 * 3. Listens for incoming messages
 * 4. Routes messages to appropriate processors
 * 5. Sends responses back via WhatsApp
 */

const { create, Client } = require('@open-wa/wa-automate');
const { config, validate } = require('./config');
const memory = require('./services/memory');
const { routeMessage } = require('./router');
const logger = require('./utils/logger');

// Track state
let client = null;
let isReady = false;
let messageCount = 0;
let startTime = Date.now();

/**
 * Handle incoming messages
 */
async function onMessage(message) {
  // Ignore messages from self
  if (message.fromMe) return;

  // Ignore status broadcast
  if (message.to === 'status@broadcast') return;

  // Ignore group messages (optional — uncomment to handle groups)
  // if (message.isGroupMsg) return;

  const userId = message.sender?.id || message.author || message.from;
  const chatId = message.chatId || message.from;

  logger.info({
    userId,
    chatId,
    type: message.type,
    body: message.body?.substring(0, 50),
  }, '📩 Incoming message');

  messageCount++;

  try {
    // Send a "thinking" indicator (optional — WhatsApp doesn't natively support this well)
    // await client.simulateTyping(chatId, true);

    // Route and process the message
    const response = await routeMessage(message, client);

    if (response) {
      // Send the response
      await client.sendText(chatId, response);
      logger.info({ userId, responseLength: response.length }, '📤 Response sent');
    }
  } catch (err) {
    logger.error({ err: err.message, userId, stack: err.stack }, '❌ Error processing message');

    // Send a fallback error message
    try {
      await client.sendText(chatId, "Sorry, something went wrong on my end. Please try again in a moment.");
    } catch (sendErr) {
      logger.error({ err: sendErr.message }, 'Could not send error message');
    }
  }
}

/**
 * Handle QR code for authentication
 */
function onQR(qr) {
  logger.info('🔐 Scan this QR code in WhatsApp to connect Shy:');
  // The QR will be shown in the terminal by OpenWA
}

/**
 * Handle session status changes
 */
function onStateChanged(state) {
  logger.info({ state }, 'Session state changed');

  if (state === 'UNPAIRED') {
    logger.warn('Session unpaired — please re-scan QR code');
  }
}

/**
 * Handle connection status
 */
function onConnectionState(state) {
  logger.info({ state }, 'Connection state changed');
  isReady = state === 'CONNECTED';

  if (isReady) {
    logger.info('✅ Shy is connected and ready!');
  } else {
    logger.warn('⚠️  Shy disconnected');
  }
}

/**
 * Handle incoming ack (message delivery confirmations)
 */
function onAck(ack) {
  // Optional: track message delivery
}

/**
 * Initialize and start the bot
 */
async function start() {
  logger.info('🚀 Starting Prakrit AI — Shy Bot');
  logger.info(`   Bot name: ${config.botName}`);
  logger.info(`   Default language: ${config.defaultLanguage}`);
  logger.info(`   Max history: ${config.maxHistory} messages`);
  logger.info(`   Conversation TTL: ${config.conversationTTLHours} hours`);

  // Validate configuration
  validate();

  // Initialize memory
  await memory.init();

  // Create OpenWA client
  logger.info('📱 Initializing WhatsApp client (OpenWA)...');

  try {
    client = await create({
      sessionId: 'shy-bot',
      multiDevice: true,
      authTimeout: 60000,
      blockCrashLogs: true,
      cacheEnabled: false,
      chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    // Register event handlers
    client.onMessage(onMessage);
    client.onStateChanged(onStateChanged);
    client.onConnectionState(onConnectionState);
    client.onAck(onAck);

    logger.info('✅ WhatsApp client initialized. Waiting for QR code scan...');

    // Keep the process alive
    keepAlive();

  } catch (err) {
    logger.fatal({ err: err.message }, 'Failed to initialize WhatsApp client');
    process.exit(1);
  }
}

/**
 * Keep process alive and log periodic stats
 */
function keepAlive() {
  setInterval(() => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMins = Math.floor((uptime % 3600) / 60);

    logger.info({
      uptime: `${uptimeHours}h ${uptimeMins}m`,
      messages: messageCount,
      connected: isReady,
    }, '📊 Bot status');
  }, 5 * 60 * 1000); // Every 5 minutes
}

/**
 * Graceful shutdown
 */
async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down gracefully...');

  if (client) {
    try {
      // Close WhatsApp connection
      await client.close();
    } catch {
      // Ignore close errors
    }
  }

  logger.info('Goodbye! 👋');
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
  logger.fatal({ err: err.message, stack: err.stack }, 'Uncaught exception');
  shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  logger.error({ reason: String(reason) }, 'Unhandled rejection');
});

// Start the bot
start();
