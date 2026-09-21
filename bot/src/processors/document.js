/**
 * Document Processor
 * Handles PDFs and document images (lab reports, prescriptions, etc.)
 * Uses Azure Document Intelligence if available, falls back to GPT-4 Vision.
 */

const azureDocs = require('../services/azure-docs');
const azureOpenAI = require('../services/azure-openai');
const memory = require('../services/memory');
const { buildSystemPrompt } = require('../prompts/system');
const { detectLanguage } = require('../utils/language');
const { formatResponse } = require('../utils/formatter');
const logger = require('../utils/logger');
const { config } = require('../config');

/**
 * Process a document message (PDF or document image)
 * @param {string} userId - User's phone/chat ID
 * @param {object} message - OpenWA message object
 * @param {object} client - OpenWA client
 * @returns {string} Formatted response
 */
async function processDocumentMessage(userId, message, client) {
  logger.info({ userId, type: message.type }, 'Processing document message');

  try {
    // Download the document
    const mediaData = await client.downloadMedia(message);

    if (!mediaData || !mediaData.data) {
      throw new Error('Failed to download document');
    }

    const docBuffer = Buffer.from(mediaData.data, 'base64');
    const mimeType = mediaData.mimetype || 'application/pdf';

    logger.debug({ userId, mimeType, bufferSize: docBuffer.length }, 'Document downloaded');

    let docContent = '';
    let userText = message.body || ''; // Caption if any

    if (azureDocs.isAvailable() && (mimeType === 'application/pdf' || mimeType.includes('image'))) {
      // Use Azure Document Intelligence for structured extraction
      const docResult = await azureDocs.analyzeDocument(docBuffer, mimeType);
      docContent = azureDocs.formatForLLM(docResult);
    } else {
      // Fall back to GPT-4 Vision for image-based documents
      if (mimeType.includes('image')) {
        const imageBase64 = mediaData.data;
        const visionPrompt = `Analyze this medical document image. Extract all text, values, test results, and any medical information. Be thorough and accurate.`;
        docContent = await azureOpenAI.visionCompletion(imageBase64, visionPrompt);
      } else {
        // PDF without Azure DI — try to extract what we can
        docContent = '[Document could not be processed. Please send a clearer image or PDF.]';
      }
    }

    if (!docContent || docContent.trim().length < 10) {
      return "I couldn't read this document clearly. Could you send a clearer photo or make sure the text is visible?";
    }

    // Detect language from caption or default
    const lang = userText ? await detectLanguage(userText) : { rule: 'Reply in English.' };

    // Build system prompt
    const systemPrompt = buildSystemPrompt(config.botName, lang.rule);

    // Get conversation history
    const history = await memory.getHistory(userId);

    // Build the document analysis prompt
    const docPrompt = userText
      ? `The user sent a medical document and said: "${userText}". Here is the document content:\n\n${docContent}\n\nAnalyze this and respond helpfully.`
      : `The user sent a medical document. Here is the extracted content:\n\n${docContent}\n\nAnalyze the key values and provide helpful health information. Call out important findings in plain sentences. Always recommend consulting a doctor for medical advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: docPrompt },
    ];

    // Call Azure OpenAI
    const rawResponse = await azureOpenAI.chatCompletion(messages, { maxTokens: 400 });

    // Format response
    const response = formatResponse(rawResponse);

    // Save to memory
    const userMsg = userText || '[Sent a document]';
    await memory.addMessage(userId, 'user', userMsg);
    await memory.addMessage(userId, 'assistant', response);

    logger.info({ userId, responseLength: response.length }, 'Document message processed');
    return response;
  } catch (err) {
    logger.error({ err: err.message, userId }, 'Document processing failed');
    return "Sorry, I had trouble reading that document. Could you try sending it again as a clearer photo?";
  }
}

module.exports = { processDocumentMessage };
