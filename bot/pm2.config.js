module.exports = {
  apps: [{
    name: 'shy-bot',
    script: './src/bot.js',
    instances: 1,        // OpenWA needs single instance (WhatsApp Web session)
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/shy-error.log',
    out_file: './logs/shy-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    restart_delay: 5000,     // Wait 5s before restart
    max_restarts: 10,        // Max restarts in stable period
    min_uptime: '30s',       // Consider started after 30s
    kill_timeout: 10000,     // Wait 10s for graceful shutdown
    listen_timeout: 10000,
  }]
};
