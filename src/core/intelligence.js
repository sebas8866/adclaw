import axios from 'axios';
import { config } from '../config/defaults.js';
import { logger } from '../utils/logger.js';

/**
 * Three-tier intelligence system:
 *   Tier 1: Local Ollama (every 15 min) — fast checks, metric parsing
 *   Tier 2: Kimi deep research (hourly) — competitor analysis, trend detection
 *   Tier 3: Claude Opus (daily) — critical budget/strategy decisions
 */

// ── Tier 1: Local Ollama ──────────────────────────────────────────────

export async function queryLocal(prompt, { model, temperature = 0.3 } = {}) {
  const ollamaModel = model || config.intelligence.local.model;
  const baseUrl = config.intelligence.local.baseUrl;

  try {
    const res = await axios.post(`${baseUrl}/api/generate`, {
      model: ollamaModel,
      prompt,
      stream: false,
      options: { temperature },
    }, { timeout: 30_000 });

    return {
      tier: 'local',
      model: ollamaModel,
      response: res.data.response,
      tokensUsed: res.data.eval_count || 0,
      durationMs: res.data.total_duration ? res.data.total_duration / 1e6 : 0,
    };
  } catch (err) {
    logger.warn(`Ollama query failed: ${err.message} — will escalate to Kimi`);
    return null;
  }
}

// ── Tier 2: Kimi Deep Research ────────────────────────────────────────

export async function queryKimi(prompt, { searchEnabled = true } = {}) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    logger.warn('KIMI_API_KEY not set — skipping Kimi tier');
    return null;
  }

  try {
    const res = await axios.post(
      `${config.intelligence.kimi.baseUrl}/chat/completions`,
      {
        model: config.intelligence.kimi.model,
        messages: [
          {
            role: 'system',
            content: 'You are a digital advertising research analyst. Provide data-driven insights with specific metrics and actionable recommendations.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        ...(searchEnabled && { use_search: true }),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120_000,
      }
    );

    return {
      tier: 'kimi',
      model: config.intelligence.kimi.model,
      response: res.data.choices[0].message.content,
      tokensUsed: res.data.usage?.total_tokens || 0,
    };
  } catch (err) {
    logger.warn(`Kimi query failed: ${err.message}`);
    return null;
  }
}

// ── Tier 3: Claude Opus (Critical Decisions) ──────────────────────────

export async function queryOpus(prompt, { systemPrompt } = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    logger.error('ANTHROPIC_API_KEY not set — cannot make Opus decision');
    return null;
  }

  try {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: config.intelligence.opus.model,
        max_tokens: 4096,
        system: systemPrompt || `You are the chief strategist for an autonomous AI ad agency.
You make critical budget allocation, campaign strategy, and go/no-go decisions.
Always respond with structured JSON containing: decision, reasoning, actions[], confidence (0-1).`,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );

    const content = res.data.content[0].text;
    return {
      tier: 'opus',
      model: config.intelligence.opus.model,
      response: content,
      tokensUsed: (res.data.usage?.input_tokens || 0) + (res.data.usage?.output_tokens || 0),
    };
  } catch (err) {
    logger.error(`Opus query failed: ${err.message}`);
    return null;
  }
}

// ── Tiered Escalation Engine ──────────────────────────────────────────

/**
 * Runs a query through the intelligence tiers.
 * @param {string} prompt
 * @param {'local'|'kimi'|'opus'} minTier - Minimum tier to start at
 * @param {Function} shouldEscalate - (result) => boolean — decides if we need a higher tier
 */
export async function tieredQuery(prompt, { minTier = 'local', shouldEscalate } = {}) {
  const tiers = ['local', 'kimi', 'opus'];
  const startIdx = tiers.indexOf(minTier);

  const queryFns = { local: queryLocal, kimi: queryKimi, opus: queryOpus };

  for (let i = startIdx; i < tiers.length; i++) {
    const tier = tiers[i];
    logger.info(`Intelligence query → Tier: ${tier}`);

    const result = await queryFns[tier](prompt);
    if (!result) continue; // tier unavailable, escalate

    if (!shouldEscalate || !shouldEscalate(result) || tier === 'opus') {
      return result;
    }

    logger.info(`Escalating from ${tier} — response needs deeper analysis`);
  }

  logger.error('All intelligence tiers exhausted');
  return null;
}
