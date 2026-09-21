/**
 * Response Formatter
 * Ensures all responses are clean plain text suitable for WhatsApp.
 * Strips markdown, emojis, limits length.
 */

function formatResponse(text) {
  if (!text) return '';

  let cleaned = text;

  // Strip markdown formatting
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');  // bold
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');       // italic
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');       // strikethrough
  cleaned = cleaned.replace(/`(.*?)`/g, '$1');         // inline code
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');    // code blocks
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');       // headers

  // Strip bullet points and numbered lists
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

  // Strip emojis (basic range)
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  // Enforce line limit (3-5 lines)
  const lines = cleaned.split('\n').filter(l => l.trim().length > 0);
  if (lines.length > 5) {
    cleaned = lines.slice(0, 5).join('\n');
  }

  return cleaned;
}

/**
 * Build a "typing" indicator message
 */
function typingMessage() {
  return null; // WhatsApp doesn't support typing indicators via OpenWA easily
}

/**
 * Check if a message is a health-related query
 */
function isHealthRelated(text) {
  const healthKeywords = [
    'health', 'symptom', 'pain', 'fever', 'cold', 'cough', 'headache',
    'medicine', 'doctor', 'hospital', 'blood', 'pressure', 'sugar',
    'diet', 'nutrition', 'exercise', 'sleep', 'stress', 'anxiety',
    'depression', 'allergy', 'infection', 'vaccine', 'pregnancy',
    'weight', 'skin', 'hair', 'dental', 'eye', 'heart', 'lung',
    'stomach', 'vomit', 'diarrhea', 'constipation', 'breathing',
    'asthma', 'diabetes', 'bp', 'temperature', 'tablet', 'capsule',
    'syrup', 'injection', 'test', 'report', 'lab', 'prescription',
    'swasthya', 'bukhar', 'sardi', 'khansi', 'dard', 'ilaj',
    // Marathi
    'aarogya', 'taap', 'khokla', 'dukhne',
    // Tamil
    'uyir', 'niram',
    // Telugu
    'arogya',
  ];

  const lower = text.toLowerCase();
  return healthKeywords.some(kw => lower.includes(kw));
}

module.exports = { formatResponse, isHealthRelated };
