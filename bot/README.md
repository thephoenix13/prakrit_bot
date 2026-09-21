# Prakrit AI — Shy Bot

WhatsApp healthcare AI assistant for Prakrit AI.

## Quick Start

```bash
# 1. Install dependencies
cd bot
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Start in development
npm run dev

# 4. Start in production (with PM2)
npm run pm2:start
```

## Architecture

```
User (WhatsApp) → OpenWA → Router → Processor → AI Service → Response → OpenWA → User
```

### Message Types
- **Text** → Azure OpenAI (GPT-4o)
- **Voice** → Deepgram STT → Azure OpenAI
- **Document** → Azure Doc Intelligence / GPT-4 Vision → Azure OpenAI
- **Image** → GPT-4 Vision → Azure OpenAI

## Configuration

See `.env.example` for all available options.

### Required
- `DEEPGRAM_API_KEY` — Deepgram subscription key
- `AZURE_OPENAI_ENDPOINT` — Azure OpenAI resource endpoint
- `AZURE_OPENAI_API_KEY` — Azure OpenAI API key

### Optional
- `AZURE_DOC_ENDPOINT` / `AZURE_DOC_KEY` — For document OCR (falls back to GPT-4 Vision)
- `REDIS_URL` — For persistent conversation memory (falls back to in-memory)

## Project Structure

```
bot/
├── src/
│   ├── bot.js              # Entry point — OpenWA setup
│   ├── router.js           # Message type classification
│   ├── config/index.js     # Environment config
│   ├── processors/
│   │   ├── text.js         # Text message handler
│   │   ├── voice.js        # Voice note handler
│   │   ├── document.js     # Document handler
│   │   └── image.js        # Image handler
│   ├── services/
│   │   ├── azure-openai.js # Azure OpenAI client
│   │   ├── deepgram.js     # Deepgram STT client
│   │   ├── azure-docs.js   # Azure Document Intelligence
│   │   └── memory.js       # Conversation memory
│   ├── prompts/
│   │   └── system.js       # Shy's system prompt
│   └── utils/
│       ├── formatter.js    # Response cleanup
│       ├── language.js     # Language detection
│       └── logger.js       # Structured logging
├── .env.example
├── pm2.config.js
└── package.json
```

## PM2 Commands

```bash
npm run pm2:start    # Start bot
npm run pm2:stop     # Stop bot
npm run pm2:restart  # Restart bot
npm run pm2:logs     # View logs
```

## Notes

- OpenWA uses WhatsApp Web protocol — session persists after first QR scan
- WhatsApp sessions can expire — PM2 auto-restarts handle reconnection
- Conversation memory auto-expires after configured TTL (default 24h)
- All responses are formatted as plain text (no markdown) for WhatsApp compatibility
