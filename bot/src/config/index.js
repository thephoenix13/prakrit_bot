require('dotenv').config();

const config = {
  // Bot identity
  botName: process.env.BOT_NAME || 'Shy',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',

  // Deepgram
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY,
    model: 'nova-2',
  },

  // Azure OpenAI
  azureOpenAI: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
  },

  // Azure Document Intelligence
  azureDoc: {
    endpoint: process.env.AZURE_DOC_ENDPOINT,
    key: process.env.AZURE_DOC_KEY,
  },

  // Conversation settings
  maxHistory: parseInt(process.env.MAX_CONVERSATION_HISTORY) || 15,
  conversationTTLHours: parseInt(process.env.CONVERSATION_TTL_HOURS) || 24,
  maxResponseTokens: parseInt(process.env.MAX_RESPONSE_TOKENS) || 300,
  temperature: parseFloat(process.env.TEMPERATURE) || 0.7,

  // Redis (optional)
  redisUrl: process.env.REDIS_URL || null,

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Admin
  adminPhone: process.env.ADMIN_PHONE_NUMBER || '',
};

// Validate required config
function validate() {
  const missing = [];
  if (!config.deepgram.apiKey) missing.push('DEEPGRAM_API_KEY');
  if (!config.azureOpenAI.endpoint) missing.push('AZURE_OPENAI_ENDPOINT');
  if (!config.azureOpenAI.apiKey) missing.push('AZURE_OPENAI_API_KEY');

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Copy .env.example to .env and fill in your values.');
    process.exit(1);
  }

  // Warn about optional services
  if (!config.azureDoc.endpoint) {
    console.warn('⚠️  Azure Document Intelligence not configured — will use GPT-4 Vision for documents instead.');
  }
  if (!config.redisUrl) {
    console.warn('⚠️  Redis not configured — using in-memory cache (conversation lost on restart).');
  }
}

module.exports = { config, validate };
