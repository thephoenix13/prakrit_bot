/**
 * Language Detection Utility
 * Detects the language of user input to set the correct language rule for the LLM.
 */

let francModule = null;

// Lazy-load franc (ESM module)
async function getFranc() {
  if (!francModule) {
    try {
      francModule = await import('franc');
    } catch {
      // franc not available, use fallback
      francModule = null;
    }
  }
  return francModule;
}

/**
 * ISO 639-3 to language name mapping (for languages we support)
 */
const LANGUAGE_MAP = {
  eng: 'English',
  hin: 'Hindi',
  mar: 'Marathi',
  tam: 'Tamil',
  tel: 'Telugu',
  ben: 'Bengali',
  kan: 'Kannada',
  mal: 'Malayalam',
  guj: 'Gujarati',
  pan: 'Punjabi',
  urd: 'Urdu',
  ori: 'Odia',
};

/**
 * Detect language from text and return a language rule string for the system prompt.
 */
async function detectLanguage(text) {
  const franc = await getFranc();

  if (franc && franc.franc) {
    const iso3 = franc.franc(text);
    const langName = LANGUAGE_MAP[iso3] || 'English';

    if (iso3 === 'eng') {
      return {
        code: 'en',
        name: 'English',
        rule: 'Reply in English.',
      };
    }

    // Check for mixed language (Hinglish, etc.)
    if (iso3 === 'hin' && /[a-zA-Z]{3,}/.test(text)) {
      return {
        code: 'hi-en',
        name: 'Hinglish',
        rule: 'The user is writing in Hinglish (Hindi-English mix). Reply in the same Hinglish style naturally.',
      };
    }

    return {
      code: iso3,
      name: langName,
      rule: `Reply in ${langName}. Use ${langName}'s own vocabulary — do not borrow Hindi filler words.`,
    };
  }

  // Fallback: basic heuristic detection
  return fallbackDetect(text);
}

/**
 * Fallback language detection using character ranges
 */
function fallbackDetect(text) {
  // Devanagari (Hindi/Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    // Distinguish Hindi vs Marathi by common words
    if (/\b(आहे|आहेत|काय|नक्की|म्हणजे)\b/.test(text)) {
      return { code: 'mar', name: 'Marathi', rule: 'Reply in Marathi. Use Marathi vocabulary only.' };
    }
    return { code: 'hin', name: 'Hindi', rule: 'Reply in Hindi. Use Hindi vocabulary only.' };
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return { code: 'tam', name: 'Tamil', rule: 'Reply in Tamil. Use Tamil vocabulary only.' };
  }

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return { code: 'tel', name: 'Telugu', rule: 'Reply in Telugu. Use Telugu vocabulary only.' };
  }

  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) {
    return { code: 'ben', name: 'Bengali', rule: 'Reply in Bengali. Use Bengali vocabulary only.' };
  }

  // Default to English
  return { code: 'en', name: 'English', rule: 'Reply in English.' };
}

module.exports = { detectLanguage, LANGUAGE_MAP };
