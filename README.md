# Prakrit AI — Shy Bot

WhatsApp healthcare AI assistant powered by Azure OpenAI, Deepgram, and OpenWA.

## 🎯 Overview

**Shy** is a WhatsApp bot that helps users with health-related queries. Users can send:
- 💬 Text messages
- 🎙️ Voice notes (transcribed via Deepgram)
- 📄 Documents (lab reports, prescriptions — analyzed via Azure Document Intelligence)
- 🖼️ Images (health photos — analyzed via GPT-4 Vision)

The bot responds in plain text (3-5 lines), matches the user's style and language, and always recommends consulting a doctor for serious matters.

## 📁 Repository Structure

```
prakrit-ai-shy/
├── bot/                    ← WhatsApp bot (Node.js)
│   ├── src/               ← Bot source code
│   ├── docs/              ← Deployment guides
│   ├── scripts/           ← Setup scripts
│   ├── Dockerfile         ← Docker containerization
│   ├── docker-compose.yml ← Local Docker setup
│   └── README.md          ← Bot documentation
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml      ← GitHub Actions CI/CD
│
└── README.md              ← This file
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd prakrit-ai-shy
```

### 2. Setup Bot

```bash
cd bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start in development
npm run dev

# Scan QR code with WhatsApp
```

### 3. Deploy to Azure

See [Azure Deployment Guide](bot/docs/AZURE_DEPLOYMENT.md) for complete instructions.

**Quick summary:**
```bash
# Run Azure setup script
chmod +x scripts/azure-setup.sh
./scripts/azure-setup.sh

# Configure GitHub secrets (see bot/docs/GITHUB_SECRETS.md)
# Push to main branch → CI/CD deploys automatically
```

## 📚 Documentation

### Bot Documentation
- [Bot README](bot/README.md) — Complete bot documentation
- [Azure Deployment](bot/docs/AZURE_DEPLOYMENT.md) — Azure setup guide
- [GitHub Secrets](bot/docs/GITHUB_SECRETS.md) — CI/CD secrets setup

### Architecture
- **Interactive Dashboard** — Run `npm run build` in root, then open `dist/index.html`
  - Dashboard with stats and quick actions
  - Setup guide with step-by-step instructions
  - Architecture diagrams
  - Code reference
  - Testing checklist

## 🔑 Prerequisites

### Required
- **Node.js 18+** — [Download](https://nodejs.org)
- **Deepgram API Key** — [Get key](https://console.deepgram.com)
- **Azure OpenAI** — [Setup guide](https://learn.microsoft.com/azure/ai-services/openai/)
- **Chrome/Chromium** — Required by OpenWA

### Optional
- **Azure Document Intelligence** — For document OCR
- **Redis** — For persistent conversation memory
- **Azure Subscription** — For deployment

## 🏗️ Architecture

```
User (WhatsApp) → OpenWA → Router → Processor → AI Service → Response → User
```

### Message Processing
- **Text** → Azure OpenAI (GPT-4o)
- **Voice** → Deepgram STT → Azure OpenAI
- **Document** → Azure Doc Intelligence / GPT-4 Vision → Azure OpenAI
- **Image** → GPT-4 Vision → Azure OpenAI

### Key Features
- ✅ Style mirroring (matches user's tone, language, formality)
- ✅ Multilingual support (English, Hindi, Marathi, Tamil, Telugu, Bengali, etc.)
- ✅ Plain text output (WhatsApp compatible)
- ✅ Conversation memory (sliding window, auto-expiry)
- ✅ Rate limiting (prevents abuse)
- ✅ Admin commands (/status, /clear, /users, etc.)
- ✅ Health check endpoint (for load balancers)
- ✅ Graceful degradation (Redis → in-memory, Azure DI → GPT-4 Vision)
- ✅ Structured logging (Pino)
- ✅ Metrics collection (response times, message counts)
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ Azure Container Apps deployment

## 🧪 Testing

### Local Testing

```bash
cd bot
npm run dev

# Send test messages from WhatsApp:
# - Text: "I have a headache since morning"
# - Voice: Record a voice note
# - Document: Send a photo of a lab report
# - Image: Send a health-related image
```

### Admin Commands

Send from your admin phone number (set in `ADMIN_PHONE_NUMBER`):

```
/status      — Show bot status and stats
/clear <num> — Clear conversation for a user
/clearall    — Clear all conversations
/users       — List active users
/metrics     — Show performance metrics
/ping        — Check if bot is alive
/help        — Show all admin commands
```

### Health Checks

```bash
curl http://localhost:3000/health    # Liveness check
curl http://localhost:3000/ready     # Readiness check
curl http://localhost:3000/metrics   # Detailed metrics
curl http://localhost:3000/status    # Human-readable status
```

## 🐳 Docker

### Local Development

```bash
cd bot

# Build and run with Docker Compose (includes Redis)
docker-compose up -d

# View logs
docker-compose logs -f shy-bot

# Stop
docker-compose down
```

### Production

See [Azure Deployment Guide](bot/docs/AZURE_DEPLOYMENT.md) for production Docker setup.

## 📊 Monitoring

### Logs

```bash
# Development
npm run dev  # Logs to console

# Production (PM2)
npm run pm2:logs

# Docker
docker-compose logs -f shy-bot

# Azure
az containerapp logs show --name shy-bot --resource-group prakrit-ai-rg --follow
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

## 💰 Cost Estimation

### Infrastructure (Monthly)
- Azure Container Apps: $20-40
- Redis (Basic): $15
- Container Registry: $5
- Log Analytics: $5
- **Total Infrastructure**: $45-65/month

### API Costs (per 1000 messages)
- Azure OpenAI GPT-4o: ~$5
- Deepgram Nova-2: ~$1-3 (assuming 30% voice notes)
- Azure Document Intelligence: ~$0.50 (assuming 20% documents)
- **Total API**: ~$7-9 per 1000 messages

### Total Estimated Cost
- **Low usage** (100 msgs/day): ~$70-90/month
- **Medium usage** (1000 msgs/day): ~$225-245/month
- **High usage** (10000 msgs/day): ~$700-900/month

## 🔧 Troubleshooting

### WhatsApp Session Expired

```bash
# Check logs
npm run pm2:logs

# Restart and re-scan QR
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

## 📝 Environment Variables

See [bot/.env.example](bot/.env.example) for all available options.

**Required:**
- `DEEPGRAM_API_KEY` — Deepgram API key
- `AZURE_OPENAI_ENDPOINT` — Azure OpenAI resource endpoint
- `AZURE_OPENAI_API_KEY` — Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT` — GPT-4o deployment name

**Optional:**
- `AZURE_DOC_ENDPOINT` / `AZURE_DOC_KEY` — Document Intelligence
- `REDIS_URL` — Redis connection string
- `ADMIN_PHONE_NUMBER` — Admin phone for commands
- `BOT_NAME` — Bot name (default: Shy)
- `LOG_LEVEL` — Logging level (default: info)

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
- See [Bot README](bot/README.md) for detailed documentation

## 🎓 Learning Resources

- [OpenWA Documentation](https://docs.openwa.dev/)
- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [Deepgram Docs](https://developers.deepgram.com/docs)
- [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)

---

**Built with ❤️ for Prakrit AI**

For detailed bot documentation, see [bot/README.md](bot/README.md).
