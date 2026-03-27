import { BaseAgent } from './base.js';

/**
 * AI Coach Agent (v2 placeholder)
 *
 * Future responsibilities:
 *   - Client-facing AI assistant for strategy Q&A
 *   - Proactive recommendations via Slack/email
 *   - Campaign performance explanations in plain language
 *   - Budget recommendation engine
 *   - Onboarding guidance for new clients
 */
export class CoachAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'coach');
    this.enabled = false; // v2 — not yet active
  }

  /**
   * Placeholder: Answer a client question about their campaigns.
   */
  async answerQuestion(question) {
    return this.run('answerQuestion', async () => {
      if (!this.enabled) {
        return {
          response: 'AI Coach is coming in v2. For now, check your daily reports for campaign insights.',
          available: false,
        };
      }

      // v2: Use tieredQuery with campaign context
      return { response: 'Not yet implemented', available: false };
    });
  }

  /**
   * Placeholder: Generate proactive recommendation.
   */
  async generateRecommendation() {
    return this.run('generateRecommendation', async () => {
      return { enabled: false, message: 'v2 feature' };
    });
  }
}
