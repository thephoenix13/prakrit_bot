/**
 * Health Check HTTP Server
 * Lightweight HTTP server for health checks, metrics, and monitoring.
 * Used by Azure Container Apps / Load Balancer to check if bot is alive.
 */

const http = require('http');
const { getMetrics } = require('./services/metrics');
const memory = require('./services/memory');
const logger = require('./utils/logger');

let server = null;
let isWhatsAppConnected = false;

/**
 * Set WhatsApp connection status
 */
function setConnected(connected) {
  isWhatsAppConnected = connected;
}

/**
 * Start the health check server
 * @param {number} port - Port to listen on (default: 3000)
 */
function startServer(port = process.env.PORT || 3000) {
  server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // CORS headers for dashboard
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      switch (url.pathname) {
        case '/health':
        case '/healthz':
          handleHealth(res);
          break;

        case '/ready':
        case '/readyz':
          handleReady(res);
          break;

        case '/metrics':
          await handleMetrics(res);
          break;

        case '/status':
          await handleStatus(res);
          break;

        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (err) {
      logger.error({ err: err.message }, 'Health server error');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });

  server.listen(port, () => {
    logger.info({ port }, `Health check server listening on port ${port}`);
  });

  return server;
}

/**
 * /health — Basic liveness check (always returns 200 if process is running)
 */
function handleHealth(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));
}

/**
 * /ready — Readiness check (returns 200 only if WhatsApp is connected)
 */
function handleReady(res) {
  if (isWhatsAppConnected) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ready',
      whatsapp: 'connected',
      timestamp: new Date().toISOString(),
    }));
  } else {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'not_ready',
      whatsapp: 'disconnected',
      timestamp: new Date().toISOString(),
    }));
  }
}

/**
 * /metrics — Detailed metrics (JSON)
 */
async function handleMetrics(res) {
  const metrics = getMetrics();
  const activeUsers = await memory.getActiveUsers();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    ...metrics,
    activeUsers: activeUsers.length,
    whatsapp: isWhatsAppConnected ? 'connected' : 'disconnected',
  }));
}

/**
 * /status — Human-readable status (for quick checks)
 */
async function handleStatus(res) {
  const metrics = getMetrics();
  const activeUsers = await memory.getActiveUsers();
  const memUsage = process.memoryUsage();

  const status = {
    bot: 'Shy — Prakrit AI',
    whatsapp: isWhatsAppConnected ? '✅ Connected' : '❌ Disconnected',
    uptime: metrics.uptime,
    messages: {
      total: metrics.totalMessages,
      text: metrics.textMessages,
      voice: metrics.voiceMessages,
      documents: metrics.documentMessages,
      images: metrics.imageMessages,
    },
    performance: {
      avgResponseTime: `${metrics.avgResponseTime}ms`,
      p95ResponseTime: `${metrics.p95ResponseTime}ms`,
      p99ResponseTime: `${metrics.p99ResponseTime}ms`,
    },
    activeUsers: activeUsers.length,
    errors: metrics.errors,
    memory: {
      used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    },
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(status, null, 2));
}

/**
 * Stop the server
 */
function stopServer() {
  if (server) {
    server.close();
    server = null;
    logger.info('Health check server stopped');
  }
}

module.exports = { startServer, stopServer, setConnected };
