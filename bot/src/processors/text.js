/**
 * Text Message Processor
 * Handles plain text messages — the simplest flow.
 */

const azureOpenAI = require('../services/azure-openai');
const memory = require('../services/memory');
const { buildSystemPrompt } = require('../prompts/system');
const { detectLanguage } = require('../utils/language');
const { formatResponse, isHealthRelated } = require('../utils/formatter');
const logger = require('../utils/logger');
const { config } = require('../config');

/**
 * Process a text message
 * @param {string} userId - User's phone/chat ID
 * @param {string} text - The message text
 * @returns {string} Formatted response
 */
async function processTextMessage(userId, text) {
  logger.info({ userId, text: text.substring(0, 50) }, 'Processing text message');

  // Check if health-related
  if (!isHealthRelated(text)) {
    const history = await memory.getHistory(userId);
    if (history.length === 0) {
      // First message and not health-related — gently redirect
      return "Hey! I'm Shy, your health assistant. I can help with nutrition, fitness, symptoms, lab reports, and other health topics. What's on your mind?";
    }
    // In ongoing conversation, still try to be helpful but redirect
    return "I mainly focus on health topics. Could you ask me something health-related? I'm here to help with symptoms, nutrition, fitness, lab reports, and more.";
  }

  // Detect language
  const lang = await detectLanguage(text);
  logger.debug({ userId, language: lang.name }, 'Detected language');

  // Build system prompt with language rule
  const systemPrompt = buildSystemPrompt(config.botName, lang.rule);

  // Get conversation history
  const history = await memory.getHistory(userId);

  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: text },
  ];

  // Call Azure OpenAI
  const rawResponse = await azureOpenAI.chatCompletion(messages);

  // Format response
  const response = formatResponse(rawResponse);

  // Save to memory
  await memory.addMessage(userId, 'user', text);
  await memory.addMessage(userId, 'assistant', response);

  logger.info({ userId, responseLength: response.length }, 'Text message processed');
  return response;
}

module.exports = { processTextMessage };
