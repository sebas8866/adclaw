import axios from 'axios';
import { logger } from '../utils/logger.js';

/**
 * Nano Banana Pro image generation wrapper.
 * Falls back to APIYI/Kie.ai if primary endpoint fails.
 *
 * Supports: text-to-image, image-to-image, style transfer
 */

const PROVIDERS = [
  {
    name: 'nano-banana',
    baseUrl: () => process.env.NANO_BANANA_BASE_URL || 'https://api.nanobanana.pro/v1',
    apiKey: () => process.env.NANO_BANANA_API_KEY,
    endpoint: '/images/generations',
    mapRequest: (opts) => ({
      prompt: opts.prompt,
      negative_prompt: opts.negativePrompt || 'blurry, low quality, text, watermark, logo',
      width: opts.width || 1080,
      height: opts.height || 1080,
      num_images: opts.count || 1,
      model: opts.model || 'nano-banana-pro',
    }),
    mapResponse: (data) => ({
      url: data.data?.[0]?.url || data.images?.[0]?.url,
      urls: (data.data || data.images || []).map((img) => img.url),
    }),
  },
  {
    name: 'apiyi',
    baseUrl: () => process.env.APIYI_BASE_URL || 'https://api.apiyi.com/v1',
    apiKey: () => process.env.APIYI_API_KEY,
    endpoint: '/images/generations',
    mapRequest: (opts) => ({
      prompt: opts.prompt,
      size: `${opts.width || 1080}x${opts.height || 1080}`,
      n: opts.count || 1,
      model: 'kie-ai-v1',
    }),
    mapResponse: (data) => ({
      url: data.data?.[0]?.url,
      urls: (data.data || []).map((img) => img.url),
    }),
  },
];

/**
 * Generate an image using the provider cascade.
 *
 * @param {object} opts
 * @param {string} opts.prompt - Image generation prompt
 * @param {string} opts.negativePrompt - What to avoid
 * @param {number} opts.width - Image width (default 1080)
 * @param {number} opts.height - Image height (default 1080)
 * @param {number} opts.count - Number of images (default 1)
 * @returns {{ provider: string, url: string, urls: string[] }}
 */
export async function generateImage(opts) {
  for (const provider of PROVIDERS) {
    const apiKey = provider.apiKey();
    if (!apiKey) {
      logger.debug(`Skipping ${provider.name} — no API key`);
      continue;
    }

    try {
      const res = await axios.post(
        `${provider.baseUrl()}${provider.endpoint}`,
        provider.mapRequest(opts),
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 120_000,
        }
      );

      const result = provider.mapResponse(res.data);
      logger.info(`Image generated via ${provider.name}: ${result.url}`);

      return {
        provider: provider.name,
        ...result,
      };
    } catch (err) {
      logger.warn(`${provider.name} image gen failed: ${err.message} — trying next provider`);
    }
  }

  throw new Error('All image generation providers failed');
}

/**
 * Generate multiple ad creative variations in batch.
 */
export async function generateAdCreatives({ prompts, width = 1080, height = 1080 }) {
  const results = [];

  for (const prompt of prompts) {
    try {
      const result = await generateImage({ prompt, width, height });
      results.push({ prompt, ...result, success: true });
    } catch (err) {
      results.push({ prompt, success: false, error: err.message });
    }
  }

  return results;
}
