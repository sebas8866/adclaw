import { BaseAgent } from './base.js';
import { queryLocal, queryKimi, tieredQuery } from '../core/intelligence.js';

/**
 * Research Agent — gathers business intelligence, competitor data,
 * audience insights, and trending ad formats.
 *
 * Tier 1 (local/15min): Parse metrics, check for anomalies
 * Tier 2 (Kimi/hourly): Deep competitor & trend research
 */
export class ResearchAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'research');
  }

  /**
   * Phase 1: Analyze the business page URL to extract niche,
   * audience, competitors, and initial ad angle suggestions.
   */
  async analyzeBusinessPage(url) {
    return this.run('analyzeBusinessPage', async () => {
      const prompt = `Analyze this business page for ad campaign planning: ${url}

Extract and return as JSON:
{
  "businessName": "",
  "niche": "",
  "targetAudience": { "demographics": "", "interests": [], "painPoints": [] },
  "competitors": [],
  "uniqueSellingPoints": [],
  "suggestedAdAngles": [],
  "toneOfVoice": "",
  "bestPlatforms": ["meta", "google"]
}`;

      const result = await tieredQuery(prompt, {
        minTier: 'local',
        shouldEscalate: (res) => {
          // Escalate if local model gives a short or uncertain response
          return res.response.length < 200;
        },
      });

      if (result) {
        try {
          this.state.insights = JSON.parse(
            result.response.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
          );
        } catch {
          this.state.insights = { raw: result.response, parsed: false };
        }
      }

      this.log.info(`Business analysis complete — niche: ${this.state.insights.niche || 'unknown'}`);
      return this.state.insights;
    });
  }

  /**
   * Hourly deep research via Kimi — competitor ads, trending hooks,
   * seasonal opportunities.
   */
  async deepResearch() {
    return this.run('deepResearch', async () => {
      const niche = this.state.insights?.niche || 'general';
      const campaigns = this.state.campaigns || [];

      const prompt = `You are researching the "${niche}" advertising space.

Current active campaigns: ${campaigns.length}
Business insights: ${JSON.stringify(this.state.insights?.suggestedAdAngles || [])}

Research and return:
1. Top 3 competitor ad strategies currently running (with specific examples)
2. Trending hooks/angles in this niche (last 7 days)
3. Seasonal or event-based opportunities in the next 14 days
4. Recommended creative format changes (video vs static vs carousel)
5. Audience segment opportunities we might be missing

Return as structured JSON.`;

      const result = await queryKimi(prompt);

      if (result) {
        this.state.insights.latestResearch = {
          data: result.response,
          fetchedAt: new Date(),
          tier: result.tier,
        };
      }

      return result;
    });
  }

  /**
   * Quick local check — parse recent metrics for anomalies.
   */
  async quickMetricCheck(metrics) {
    return this.run('quickMetricCheck', async () => {
      const prompt = `Analyze these ad metrics for anomalies or opportunities. Flag anything unusual:
${JSON.stringify(metrics, null, 2)}

Respond with JSON: { "anomalies": [], "opportunities": [], "urgent": boolean }`;

      return queryLocal(prompt);
    });
  }
}
