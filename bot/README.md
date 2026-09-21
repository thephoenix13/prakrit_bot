# Prakrit AI — Shy Bot

WhatsApp healthcare AI assistant powered by Azure OpenAI, Deepgram, and OpenWA.

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd prakrit-ai-shy/bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys (see below)

# Start in development mode
npm run dev

# Scan QR code with WhatsApp → Settings → Linked Devices → Link a Device
```

### Production Deployment (Azure)

See [Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md) for complete instructions.

**Quick summary:**
1. Run `scripts/azure-setup.sh` to create Azure resources
2. Configure GitHub secrets (see [GitHub Secrets Guide](docs/GITHUB_SECRETS.md))
3. Push to `main` branch → CI/CD deploys automatically

## 📋 Prerequisites

### Required
- **Node.js 18+** — Runtime environment
- **Deepgram API Key** — Voice transcription ([get key](https://console.deepgram.com))
- **Azure OpenAI** — GPT-4o deployment ([setup guide](https://learn.microsoft.com/azure/ai-services/openai/))
- **Chrome/Chromium** — Required by OpenWA for WhatsApp Web

### Optional
- **Azure Document Intelligence** — Document OCR (falls back to GPT-4 Vision)
- **Redis** — Persistent conversation memory (falls back to in-memory)

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Required
DEEPGRAM_API_KEY=your_deepgram_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Optional
AZURE_DOC_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOC_KEY=your_doc_intelligence_key
REDIS_URL=redis://localhost:6379

# Bot config
BOT_NAME=Shy
DEFAULT_LANGUAGE=en
MAX_CONVERSATION_HISTORY=15
CONVERSATION_TTL_HOURS=24
MAX_RESPONSE_TOKENS=300
TEMPERATURE=0.7
LOG_LEVEL=info
ADMIN_PHONE_NUMBER=91XXXXXXXXXX
```

## 🏗️ Architecture

```
User (WhatsApp) → OpenWA → Router → Processor → AI Service → Response → OpenWA → User
```

### Message Types
- **Text** → Azure OpenAI (GPT-4o)
- **Voice** → Deepgram STT → Azure OpenAI
- **Document** → Azure Doc Intelligence / GPT-4 Vision → Azure OpenAI
- **Image** → GPT-4 Vision → Azure OpenAI

### Key Features
- ✅ Style mirroring (matches user's tone, language, formality)
- ✅ Multilingual support (English, Hindi, Marathi, Tamil, Telugu, Bengali, etc.)
- ✅ Plain text output (no markdown — WhatsApp compatible)
- ✅ Conversation memory (sliding window, auto-expiry)
- ✅ Rate limiting (prevents abuse)
- ✅ Admin commands (/status, /clear, /users, etc.)
- ✅ Health check endpoint (for load balancers)
- ✅ Graceful degradation (Redis → in-memory, Azure DI → GPT-4 Vision)
- ✅ Structured logging (Pino)
- ✅ Metrics collection (response times, message counts)

## 📁 Project Structure

```
bot/
├── src/
│   ├── bot.js              ← Entry point (OpenWA + event handlers)
│   ├── router.js           ← Message type classifier
│   ├── server.js           ← Health check HTTP server
│   ├── config/
│   │   └── index.js        ← Environment config loader
│   ├── processors/
│   │   ├── text.js         ← Text → LLM
│   │   ├── voice.js        ← Voice → Deepgram → LLM
│   │   ├── document.js     ← Doc → Azure DI → LLM
│   │   └── image.js        ← Image → GPT-4 Vision
│   ├── services/
│   │   ├── azure-openai.js ← Chat + Vision API
│   │   ├── deepgram.js     ← Speech-to-text
│   │   ├── azure-docs.js   ← Document OCR
│   │   ├── memory.js       ← Conversation history
│   │   └── metrics.js      ← Performance metrics
│   ├── middleware/
│   │   ├── rateLimit.js    ← Rate limiting
│   │   └── admin.js        ← Admin commands
│   ├── prompts/
│   │   └── system.js       ← Shy's system prompt
│   └── utils/
│       ├── formatter.js    ← Strip markdown, limit lines
│       ├── language.js     ← Detect user language
│       └── logger.js       ← Pino structured logging
├── scripts/
│   └── azure-setup.sh      ← Azure infrastructure setup
├── docs/
│   ├── AZURE_DEPLOYMENT.md ← Complete Azure deployment guide
│   └── GITHUB_SECRETS.md   ← GitHub secrets setup
├── .github/
│   └── workflows/
│       └── ci-cd.yml       ← GitHub Actions CI/CD
├── Dockerfile              ← Docker containerization
├── docker-compose.yml      ← Local Docker setup
├── .env.example            ← Environment template
├── pm2.config.js           ← PM2 process manager
└── package.json
```

## 🧪 Testing

### Local Testing

```bash
# Start bot
npm run dev

# Send test messages from WhatsApp:
# - Text: "I have a headache since morning"
# - Voice: Record a voice note
# - Document: Send a photo of a lab report
# - Image: Send a health-related image
```

### Admin Commands

Send these from your admin phone number (set in `ADMIN_PHONE_NUMBER`):

```
/status      — Show bot status and stats
/clear <num> — Clear conversation for a user
/clearall    — Clear all conversations
/users       — List active users
/metrics     — Show performance metrics
/ping        — Check if bot is alive
/help        — Show all admin commands
```

### Health Check

```bash
# Check if bot is running
curl http://localhost:3000/health

# Check if WhatsApp is connected
curl http://localhost:3000/ready

# Get detailed metrics
curl http://localhost:3000/metrics

# Get human-readable status
curl http://localhost:3000/status
```

## 🐳 Docker

### Local Docker

```bash
# Build and run with Docker Compose (includes Redis)
docker-compose up -d

# View logs
docker-compose logs -f shy-bot

# Stop
docker-compose down
```

### Production Docker

```bash
# Build image
docker build -t shy-bot:latest .

# Run container
docker run -d \
  --name shy-bot \
  --env-file .env \
  -p 3000:3000 \
  -v openwa-session:/app/.openwa-auth \
  shy-bot:latest
```

## 📊 Monitoring

### Logs

```bash
# Development
npm run dev  # Logs to console

# Production (PM2)
npm run pm2:logs

# Docker
docker-compose logs -f shy-bot
```

### Metrics

The bot collects metrics automatically:
- Total messages (by type)
- Response times (avg, p95, p99)
- Errors and rate limits
- Active users
- Memory usage

Access via:
- HTTP endpoint: `GET /metrics`
- Admin command: `/metrics`
- Azure Portal: Container App → Metrics

### Health Checks

Azure Container Apps uses these endpoints:
- `/health` — Liveness check (always 200 if running)
- `/ready` — Readiness check (200 only if WhatsApp connected)

## 🔧 Troubleshooting

### WhatsApp Session Expired

```bash
# Check logs
npm run pm2:logs

# If you see "Session unpaired", restart and re-scan QR
npm run pm2:restart
```

### Deepgram Transcription Fails

- Check API key is valid
- Verify audio format (OGG/OPUS supported)
- Check Deepgram quota in console

### Azure OpenAI Rate Limits

- Check TPM (tokens per minute) limits in Azure Portal
- Consider upgrading to higher tier
- Bot has built-in retry logic

### Redis Connection Issues

- Bot falls back to in-memory cache automatically
- Check Redis is running: `redis-cli ping`
- Verify `REDIS_URL` in .env

### High Memory Usage

- Check conversation history size (`MAX_CONVERSATION_HISTORY`)
- Reduce TTL (`CONVERSATION_TTL_HOURS`)
- Monitor with `pm2 monit` or Docker stats

## 📚 Documentation

- [Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md) — Complete Azure setup
- [GitHub Secrets Guide](docs/GITHUB_SECRETS.md) — CI/CD secrets setup
- [Architecture Plan](../dist/index.html) — Interactive architecture dashboard

## 💰 Cost Estimation

Approximate costs per 1000 messages:
- **Azure OpenAI GPT-4o**: ~$5
- **Deepgram Nova-2**: ~$1-3 (assuming 30% voice notes)
- **Azure Document Intelligence**: ~$0.50 (assuming 20% documents)
- **Total**: ~$7-9 per 1000 messages

Azure Container Apps: ~$20-40/month (depending on usage)
Redis: ~$15/month (Basic tier)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Prakrit AI.

## 🆘 Support

For issues or questions:
- Check [Troubleshooting](#-troubleshooting) section
- Review logs: `npm run pm2:logs`
- Check health endpoint: `curl http://localhost:3000/status`

---

**Built with ❤️ for Prakrit AI**
