/**
 * Azure OpenAI Service
 * Handles chat completions (text) and vision (image) calls.
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const { config } = require('../config');
const logger = require('../utils/logger');

let client = null;

function getClient() {
  if (!client) {
    client = new OpenAIClient(
      config.azureOpenAI.endpoint,
      new AzureKeyCredential(config.azureOpenAI.apiKey)
    );
  }
  return client;
}

/**
 * Send a chat completion request (text only)
 * @param {Array} messages - Array of {role, content} objects
 * @param {object} options - Optional overrides
 * @returns {string} Assistant's response text
 */
async function chatCompletion(messages, options = {}) {
  const azureClient = getClient();

  const params = {
    temperature: options.temperature || config.temperature,
    maxTokens: options.maxTokens || config.maxResponseTokens,
  };

  try {
    logger.debug({ msgCount: messages.length }, 'Calling Azure OpenAI chat completion');

    const result = await azureClient.getChatCompletions(
      config.azureOpenAI.deployment,
      messages,
      params
    );

    const response = result.choices?.[0]?.message?.content || '';
    logger.debug({ responseLength: response.length }, 'Got response from Azure OpenAI');
    return response;
  } catch (err) {
    logger.error({ err: err.message, code: err.code }, 'Azure OpenAI chat completion failed');
    throw err;
  }
}

/**
 * Send a vision request (image + text)
 * @param {string} imageBase64 - Base64 encoded image
 * @param {string} textPrompt - Text prompt to accompany the image
 * @param {Array} additionalMessages - Previous conversation messages
 * @returns {string} Assistant's response text
 */
async function visionCompletion(imageBase64, textPrompt, additionalMessages = []) {
  const azureClient = getClient();

  const messages = [
    ...additionalMessages,
    {
      role: 'user',
      content: [
        { type: 'text', text: textPrompt },
        {
          type: 'image_url',
          imageUrl: {
            url: `data:image/jpeg;base64,${imageBase64}`,
          },
        },
      ],
    },
  ];

  try {
    logger.debug('Calling Azure OpenAI vision completion');

    const result = await azureClient.getChatCompletions(
      config.azureOpenAI.deployment,
      messages,
      {
        temperature: config.temperature,
        maxTokens: config.maxResponseTokens,
      }
    );

    const response = result.choices?.[0]?.message?.content || '';
    logger.debug({ responseLength: response.length }, 'Got vision response');
    return response;
  } catch (err) {
    logger.error({ err: err.message }, 'Azure OpenAI vision completion failed');
    throw err;
  }
}

module.exports = { chatCompletion, visionCompletion };
