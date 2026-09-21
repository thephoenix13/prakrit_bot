/**
 * Deepgram Speech-to-Text Service
 * Converts voice notes (OGG/OPUS) to text.
 */

const axios = require('axios');
const { config } = require('../config');
const logger = require('../utils/logger');

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

/**
 * Transcribe audio buffer using Deepgram
 * @param {Buffer} audioBuffer - Raw audio data (OGG/OPUS from WhatsApp)
 * @param {string} mimeType - Audio MIME type (default: audio/ogg)
 * @returns {{ text: string, language: string, confidence: number }}
 */
async function transcribe(audioBuffer, mimeType = 'audio/ogg') {
  const params = new URLSearchParams({
    model: config.deepgram.model,
    language: 'multi',         // Auto-detect language
    smart_format: 'true',      // Auto-punctuate
    detect_language: 'true',   // Return detected language
    punctuate: 'true',
    interim_results: 'false',
  });

  const url = `${DEEPGRAM_API_URL}?${params.toString()}`;

  try {
    logger.debug({ bufferSize: audioBuffer.length, mimeType }, 'Sending audio to Deepgram');

    const response = await axios.post(url, audioBuffer, {
      headers: {
        'Authorization': `Token ${config.deepgram.apiKey}`,
        'Content-Type': mimeType,
      },
      timeout: 30000, // 30 second timeout
    });

    const data = response.data;
    const result = data.results?.channels?.[0]?.alternatives?.[0];

    if (!result) {
      throw new Error('No transcription result from Deepgram');
    }

    const transcription = {
      text: result.transcript || '',
      language: data.metadata?.detected_language || 'unknown',
      confidence: result.confidence || 0,
      words: result.words || [],
    };

    logger.info(
      { text: transcription.text.substring(0, 50), language: transcription.language, confidence: transcription.confidence },
      'Deepgram transcription complete'
    );

    return transcription;
  } catch (err) {
    if (err.response) {
      logger.error(
        { status: err.response.status, data: err.response.data },
        'Deepgram API error'
      );
    } else {
      logger.error({ err: err.message }, 'Deepgram transcription failed');
    }
    throw err;
  }
}

/**
 * Get language name from Deepgram language code
 */
function getLanguageName(code) {
  const languages = {
    en: 'English',
    'en-US': 'English',
    'en-GB': 'English',
    'en-IN': 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    kn: 'Kannada',
    ml: 'Malayalam',
    gu: 'Gujarati',
    pa: 'Punjabi',
    ur: 'Urdu',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
  };
  return languages[code] || code;
}

module.exports = { transcribe, getLanguageName };
