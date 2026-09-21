/**
 * Message Router
 * Classifies incoming messages by type and dispatches to the correct processor.
 */

const { processTextMessage } = require('./processors/text');
const { processVoiceMessage } = require('./processors/voice');
const { processDocumentMessage } = require('./processors/document');
const { processImageMessage } = require('./processors/image');
const logger = require('./utils/logger');

/**
 * Message types supported by the router
 */
const MESSAGE_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  AUDIO: 'audio',       // Voice notes sometimes come as 'audio'
  PTVOICE: 'ptt',       // Push-to-talk (voice notes)
  DOCUMENT: 'document',
  IMAGE: 'image',
  VIDEO: 'video',
  STICKER: 'sticker',
  LOCATION: 'location',
  CONTACT: 'vcard',
};

/**
 * Classify a message into a processing category
 * @param {object} message - OpenWA message object
 * @returns {string} Processing category
 */
function classifyMessage(message) {
  const type = message.type;
  const mimetype = message.mimetype || '';

  // Voice notes (ptt = push-to-talk)
  if (type === MESSAGE_TYPES.PTVOICE || type === MESSAGE_TYPES.VOICE || type === MESSAGE_TYPES.AUDIO) {
    return 'voice';
  }

  // Documents (PDFs, etc.)
  if (type === MESSAGE_TYPES.DOCUMENT) {
    return 'document';
  }

  // Images
  if (type === MESSAGE_TYPES.IMAGE) {
    return 'image';
  }

  // Videos (treat like images for health context)
  if (type === MESSAGE_TYPES.VIDEO) {
    return 'image'; // Process video thumbnail for now
  }

  // Plain text (default)
  if (type === MESSAGE_TYPES.TEXT) {
    return 'text';
  }

  // Unsupported types
  return 'unsupported';
}

/**
 * Route a message to the appropriate processor
 * @param {object} message - OpenWA message object
 * @param {object} client - OpenWA client instance
 * @returns {string|null} Response text or null if unsupported
 */
async function routeMessage(message, client) {
  const category = classifyMessage(message);
  const userId = message.sender?.id || message.author || message.from;

  logger.info({ userId, category, type: message.type }, 'Routing message');

  switch (category) {
    case 'text':
      return await processTextMessage(userId, message.body);

    case 'voice':
      return await processVoiceMessage(userId, message, client);

    case 'document':
      return await processDocumentMessage(userId, message, client);

    case 'image':
      return await processImageMessage(userId, message, client);

    case 'unsupported':
      logger.info({ userId, type: message.type }, 'Unsupported message type');
      return "I can handle text messages, voice notes, documents (lab reports, prescriptions), and health-related images. Could you send one of those?";

    default:
      return "I'm not sure how to handle that. Try sending text, a voice note, a document, or an image.";
  }
}

module.exports = { routeMessage, classifyMessage, MESSAGE_TYPES };
