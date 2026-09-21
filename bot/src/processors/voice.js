/**
 * Voice Note Processor
 * Downloads voice note → Deepgram STT → treat as text message
 */

const deepgram = require('../services/deepgram');
const { processTextMessage } = require('./text');
const logger = require('../utils/logger');

/**
 * Process a voice note message
 * @param {string} userId - User's phone/chat ID
 * @param {object} message - OpenWA message object
 * @param {object} client - OpenWA client (for downloading media)
 * @returns {string} Formatted response
 */
async function processVoiceMessage(userId, message, client) {
  logger.info({ userId }, 'Processing voice message');

  try {
    // Download the voice note media
    const mediaData = await client.downloadMedia(message);

    if (!mediaData || !mediaData.data) {
      throw new Error('Failed to download voice note media');
    }

    // Convert base64 data to buffer
    const audioBuffer = Buffer.from(mediaData.data, 'base64');
    const mimeType = mediaData.mimetype || 'audio/ogg';

    logger.debug({ userId, bufferSize: audioBuffer.length, mimeType }, 'Voice note downloaded');

    // Transcribe using Deepgram
    const transcription = await deepgram.transcribe(audioBuffer, mimeType);

    if (!transcription.text || transcription.text.trim().length === 0) {
      logger.warn({ userId }, 'Empty transcription result');
      return "Sorry, I couldn't understand the voice note. Could you try again or type it out?";
    }

    logger.info(
      { userId, transcribed: transcription.text.substring(0, 50), language: transcription.language },
      'Voice note transcribed'
    );

    // If confidence is very low, warn user
    if (transcription.confidence < 0.5) {
      logger.warn({ userId, confidence: transcription.confidence }, 'Low transcription confidence');
      // Still process it but the LLM might not understand well
    }

    // Process the transcribed text as a regular text message
    const response = await processTextMessage(userId, transcription.text);

    return response;
  } catch (err) {
    logger.error({ err: err.message, userId }, 'Voice message processing failed');
    return "Sorry, I had trouble processing your voice note. Could you try sending it again, or type your message instead?";
  }
}

module.exports = { processVoiceMessage };
