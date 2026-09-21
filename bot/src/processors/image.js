/**
 * Image Processor
 * Handles health-related images (skin conditions, lab screenshots, etc.)
 * Uses GPT-4 Vision for analysis.
 */

const azureOpenAI = require('../services/azure-openai');
const memory = require('../services/memory');
const { buildSystemPrompt } = require('../prompts/system');
const { detectLanguage } = require('../utils/language');
const { formatResponse } = require('../utils/formatter');
const logger = require('../utils/logger');
const { config } = require('../config');

/**
 * Process an image message
 * @param {string} userId - User's phone/chat ID
 * @param {object} message - OpenWA message object
 * @param {object} client - OpenWA client
 * @returns {string} Formatted response
 */
async function processImageMessage(userId, message, client) {
  logger.info({ userId }, 'Processing image message');

  try {
    // Download the image
    const mediaData = await client.downloadMedia(message);

    if (!mediaData || !mediaData.data) {
      throw new Error('Failed to download image');
    }

    const imageBase64 = mediaData.data;
    const userText = message.body || ''; // Caption if any

    logger.debug({ userId, imageSize: imageBase64.length }, 'Image downloaded');

    // Detect language from caption or default
    const lang = userText ? await detectLanguage(userText) : { rule: 'Reply in English.' };

    // Build system prompt
    const systemPrompt = buildSystemPrompt(config.botName, lang.rule);

    // Build vision prompt
    const visionPrompt = userText
      ? `The user sent this image and said: "${userText}". Analyze this image in a health context. Describe what you see related to health. Do NOT diagnose — describe observations only. Always recommend seeing a doctor.`
      : `Analyze this image in a health context. Describe what you observe. Do NOT diagnose any condition — only describe what you see. Always recommend the user consult a doctor for proper evaluation. Be brief and caring.`;

    // Get conversation history
    const history = await memory.getHistory(userId);

    // Build messages with vision content
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          {
            type: 'image_url',
            imageUrl: {
              url: `data:${mediaData.mimetype || 'image/jpeg'};base64,${imageBase64}`,
            },
          },
        ],
      },
    ];

    // Call Azure OpenAI with vision
    const rawResponse = await azureOpenAI.chatCompletion(messages, { maxTokens: 350 });

    // Format response
    const response = formatResponse(rawResponse);

    // Save to memory
    const userMsg = userText || '[Sent an image]';
    await memory.addMessage(userId, 'user', userMsg);
    await memory.addMessage(userId, 'assistant', response);

    logger.info({ userId, responseLength: response.length }, 'Image message processed');
    return response;
  } catch (err) {
    logger.error({ err: err.message, userId }, 'Image processing failed');
    return "Sorry, I couldn't process that image. Could you try sending it again?";
  }
}

module.exports = { processImageMessage };
