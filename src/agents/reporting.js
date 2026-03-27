import { BaseAgent } from './base.js';
import { queryLocal } from '../core/intelligence.js';

/**
 * Reporting Agent — generates daily performance reports,
 * client-facing summaries, and internal analytics.
 */
export class ReportingAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'reporting');
  }

  /**
   * Generate daily performance report.
   */
  async generateDailyReport() {
    return this.run('generateDailyReport', async () => {
      const campaigns = this.state.campaigns;
      const now = new Date();

      // Aggregate metrics
      const totals = {
        activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
        totalSpend: 0,
        totalRevenue: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        pausedAdSets: 0,
        scaledEvents: 0,
      };

      for (const campaign of campaigns) {
        for (const adSet of campaign.adSets) {
          totals.totalSpend += adSet.spend;
          totals.totalRevenue += adSet.revenue;
          totals.totalImpressions += adSet.impressions;
          totals.totalClicks += adSet.clicks;
          totals.totalConversions += adSet.conversions;
          if (adSet.status === 'paused') totals.pausedAdSets++;
        }
      }

      totals.overallRoas = totals.totalSpend > 0
        ? (totals.totalRevenue / totals.totalSpend).toFixed(2)
        : '0.00';
      totals.ctr = totals.totalImpressions > 0
        ? ((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)
        : '0.00';
      totals.cpa = totals.totalConversions > 0
        ? (totals.totalSpend / totals.totalConversions).toFixed(2)
        : 'N/A';

      // Use local LLM to generate human-readable summary
      const prompt = `Generate a brief, professional daily ad performance report from these metrics:
${JSON.stringify(totals, null, 2)}

Compliance flags: ${this.state.complianceFlags.length}
Opus strategic review: ${this.state.dailyReport?.opusReview ? 'completed' : 'pending'}

Format as a short email-style report with:
- Subject line
- Key metrics (3-4 bullets)
- Actions taken today
- Recommendations for tomorrow
Keep it under 200 words.`;

      const result = await queryLocal(prompt);

      const report = {
        date: now.toISOString().split('T')[0],
        generatedAt: now,
        metrics: totals,
        summary: result?.response || 'Report generation unavailable — metrics attached above.',
        opusReview: this.state.dailyReport?.opusReview || null,
      };

      this.state.dailyReport = report;
      this.log.info(`Daily report generated — ROAS: ${totals.overallRoas}x, Spend: $${totals.totalSpend.toFixed(2)}`);
      return report;
    });
  }

  /**
   * Get a real-time performance snapshot (no LLM needed).
   */
  getSnapshot() {
    const campaigns = this.state.campaigns;

    return {
      timestamp: new Date(),
      swarmId: this.swarm.id,
      campaigns: campaigns.map((c) => ({
        id: c.id,
        status: c.status,
        budget: c.budget,
        adSets: c.adSets.map((a) => ({
          id: a.id,
          status: a.status,
          spend: a.spend,
          roas: a.roas,
        })),
      })),
    };
  }
}
