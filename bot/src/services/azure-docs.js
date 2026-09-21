/**
 * Azure Document Intelligence Service
 * Extracts text and structured data from documents (PDFs, images of reports).
 */

const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');
const { config } = require('../config');
const logger = require('../utils/logger');

let client = null;

function getClient() {
  if (!client) {
    if (!config.azureDoc.endpoint || !config.azureDoc.key) {
      return null;
    }
    client = new DocumentAnalysisClient(
      config.azureDoc.endpoint,
      new AzureKeyCredential(config.azureDoc.key)
    );
  }
  return client;
}

/**
 * Check if Azure Document Intelligence is available
 */
function isAvailable() {
  return !!(config.azureDoc.endpoint && config.azureDoc.key);
}

/**
 * Analyze a document and extract text + tables
 * @param {Buffer} documentBuffer - PDF or image buffer
 * @param {string} contentType - MIME type (application/pdf, image/jpeg, etc.)
 * @returns {{ text: string, tables: Array, raw: object }}
 */
async function analyzeDocument(documentBuffer, contentType = 'application/pdf') {
  const docClient = getClient();

  if (!docClient) {
    throw new Error('Azure Document Intelligence not configured');
  }

  try {
    logger.debug({ contentType, bufferSize: documentBuffer.length }, 'Sending document to Azure DI');

    // Use prebuilt-layout model for general document analysis
    const poller = await docClient.beginAnalyzeDocument('prebuilt-layout', documentBuffer, {
      contentType,
    });

    const result = await poller.pollUntilDone();

    // Extract full text content
    const text = result.content || '';

    // Extract tables
    const tables = (result.tables || []).map((table, idx) => {
      const rows = [];
      for (let i = 0; i < table.rowCount; i++) {
        const row = [];
        for (let j = 0; j < table.columnCount; j++) {
          const cell = table.cells.find(c => c.rowIndex === i && c.columnIndex === j);
          row.push(cell ? cell.content : '');
        }
        rows.push(row);
      }
      return { index: idx, rows };
    });

    // Extract key-value pairs (if any)
    const keyValuePairs = (result.keyValuePairs || []).map(kv => ({
      key: kv.key?.content || '',
      value: kv.value?.content || '',
      confidence: kv.confidence || 0,
    }));

    logger.info(
      { textLength: text.length, tableCount: tables.length, kvCount: keyValuePairs.length },
      'Document analysis complete'
    );

    return {
      text,
      tables,
      keyValuePairs,
      raw: result,
    };
  } catch (err) {
    logger.error({ err: err.message }, 'Azure Document Intelligence analysis failed');
    throw err;
  }
}

/**
 * Format extracted document content for LLM context
 */
function formatForLLM(docResult) {
  let formatted = '';

  if (docResult.text) {
    formatted += `Document Content:\n${docResult.text}\n\n`;
  }

  if (docResult.tables.length > 0) {
    formatted += 'Tables found:\n';
    docResult.tables.forEach((table, i) => {
      formatted += `\nTable ${i + 1}:\n`;
      table.rows.forEach(row => {
        formatted += row.join(' | ') + '\n';
      });
    });
    formatted += '\n';
  }

  if (docResult.keyValuePairs.length > 0) {
    formatted += 'Key Values:\n';
    docResult.keyValuePairs.forEach(kv => {
      formatted += `${kv.key}: ${kv.value}\n`;
    });
  }

  return formatted;
}

module.exports = { analyzeDocument, formatForLLM, isAvailable };
