import { BaseAgent } from './base.js';
import { queryLocal, queryOpus, tieredQuery } from '../core/intelligence.js';
import { config } from '../config/defaults.js';
import { MetaAdsClient } from '../integrations/meta-oauth.js';

/**
 * Launch & Optimization Agent — the core campaign engine.
 *
 * Responsibilities:
 *   - Launch campaigns via Meta Ads API
 *   - 15-min local checks (spend pacing, anomaly detection)
 *   - Pause losers (ROAS < 2.5x after learning phase)
 *   - Scale winners (increase budget up to 30% per event)
 *   - Daily Opus review for strategic decisions
 */
export class LaunchOptimizeAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'launch-optimize');
  }

  _buildMetaTargeting() {
    const t = this.state.insights?.targetAudience || {};
    const geo = t.geo_locations || { countries: ['US'] };

    return {
      geo_locations: geo,
      age_min: Number(t.age_min || 21),
      age_max: Number(t.age_max || 55),
      publisher_platforms: Array.isArray(t.publisher_platforms) && t.publisher_platforms.length
        ? t.publisher_platforms
        : ['facebook', 'instagram'],
      facebook_positions: Array.isArray(t.facebook_positions) && t.facebook_positions.length
        ? t.facebook_positions
        : ['feed', 'story'],
      instagram_positions: Array.isArray(t.instagram_positions) && t.instagram_positions.length
        ? t.instagram_positions
        : ['stream', 'story'],
    };
  }

  /**
   * Launch a new campaign using approved creatives.
   */
  async launchCampaign() {
    return this.run('launchCampaign', async () => {
      const brief = this.state.creativeBrief || {};
      const approvedCreatives = this.state.creatives.filter(
        (c) => c.status === 'approved' || c.status === 'pending_review'
      );

      if (approvedCreatives.length === 0) {
        this.log.warn('No approved creatives to launch — marking pending_review as approved');
        this.state.creatives
          .filter((c) => c.status === 'pending_review' && !this.state.complianceFlags.length)
          .forEach((c) => (c.status = 'approved'));
      }

      // Build campaign structure
      const campaign = {
        id: `campaign-${Date.now()}`,
        status: 'active',
        createdAt: new Date(),
        budget: { daily: 20, currency: 'USD' },
        targeting: this.state.insights?.targetAudience || {},
        adSets: approvedCreatives.map((creative, i) => ({
          id: `adset-${Date.now()}-${i}`,
          creativeId: creative.id,
          status: 'active',
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          roas: 0,
          launchedAt: new Date(),
        })),
        meta: {
          executed: false,
          errors: [],
          createdAdSets: 0,
          createdAds: 0,
        },
      };

      const hasMetaExecution = !!(this.swarm.metaAccessToken && this.swarm.metaAdAccountId);
      if (hasMetaExecution) {
        try {
          if (!brief.pageId || !brief.destinationUrl) {
            throw new Error('Meta launch requires Facebook Page ID and destination URL in launch details.');
          }

          const meta = new MetaAdsClient({
            accessToken: this.swarm.metaAccessToken,
            adAccountId: this.swarm.metaAdAccountId,
          });

          const metaCampaign = await meta.createCampaign({
            name: `${this.swarm.clientId} • AdClaw ${new Date().toISOString().slice(0, 10)}`,
            objective: 'OUTCOME_TRAFFIC',
            status: 'PAUSED',
            specialAdCategories: [],
          });

          campaign.metaCampaignId = metaCampaign.id;
          campaign.targeting = this._buildMetaTargeting();

          for (let i = 0; i < campaign.adSets.length; i++) {
            const adSet = campaign.adSets[i];
            const created = await meta.createAdSet({
              campaignId: metaCampaign.id,
              name: `${this.swarm.clientId} • Set ${i + 1}`,
              dailyBudget: Math.max(5, campaign.budget.daily / Math.max(1, campaign.adSets.length)),
              targeting: campaign.targeting,
            });
            adSet.metaAdSetId = created.id;
            campaign.meta.createdAdSets++;

            const creative = approvedCreatives[i] || approvedCreatives[0];
            if (!creative || !creative.image?.url) {
              campaign.meta.errors.push(`Skipped ad creation for ad set ${created.id}: no generated image URL.`);
              continue;
            }

            const ctaType = (creative.copy?.callToAction || 'LEARN_MORE').toUpperCase();
            const adCreative = await meta.createAdCreative({
              name: `${this.swarm.clientId} • Creative ${i + 1}`,
              pageId: brief.pageId,
              message: creative.copy?.primaryText || `${brief.offer || 'Special offer'} available now.`,
              title: creative.copy?.headline || `${brief.productName || this.swarm.clientId}`,
              linkUrl: brief.destinationUrl,
              imageUrl: creative.image.url,
              ctaType,
            });
            adSet.metaCreativeId = adCreative.id;

            const ad = await meta.createAd({
              name: `${this.swarm.clientId} • Ad ${i + 1}`,
              adSetId: created.id,
              creativeId: adCreative.id,
              status: 'PAUSED',
            });
            adSet.metaAdId = ad.id;
            campaign.meta.createdAds++;
          }

          campaign.meta.executed = true;
          this.log.info(`Meta campaign ${metaCampaign.id} created on act_${this.swarm.metaAdAccountId}`);
        } catch (err) {
          campaign.status = 'local_only';
          campaign.launchError = err.message;
          campaign.meta.errors.push(err.message);
          this.log.error(`Meta launch failed: ${err.message}`);
        }
      } else {
        campaign.status = 'local_only';
        campaign.launchError = 'Meta token/account not connected; running simulation mode.';
        campaign.meta.errors.push(campaign.launchError);
      }

      this.state.campaigns.push(campaign);
      this.log.info(`Campaign ${campaign.id} launched with ${campaign.adSets.length} ad sets (${campaign.status})`);

      return campaign;
    });
  }

  /**
   * Tier 1: Local 15-minute check.
   * Evaluates spend pacing, detects anomalies, pauses losers, scales winners.
   */
  async localCheck() {
    return this.run('localCheck', async () => {
      const activeCampaigns = this.state.campaigns.filter((c) => c.status === 'active');
      if (activeCampaigns.length === 0) return { action: 'none', reason: 'no active campaigns' };

      const actions = [];

      for (const campaign of activeCampaigns) {
        for (const adSet of campaign.adSets) {
          // Skip if still in learning phase
          const hoursActive = (Date.now() - new Date(adSet.launchedAt).getTime()) / (1000 * 60 * 60);
          const daysActive = hoursActive / 24;

          if (daysActive < config.optimization.learningPhaseDays) {
            continue;
          }

          if (adSet.spend < config.optimization.minSpendBeforeDecision) {
            continue;
          }

          // Calculate ROAS
          adSet.roas = adSet.revenue > 0 ? adSet.revenue / adSet.spend : 0;

          // ── PAUSE LOSERS ──
          if (adSet.roas < config.optimization.roasFloor && adSet.status === 'active') {
            adSet.status = 'paused';
            adSet.pausedAt = new Date();
            adSet.pauseReason = `ROAS ${adSet.roas.toFixed(2)}x below ${config.optimization.roasFloor}x floor`;
            actions.push({ type: 'pause', adSetId: adSet.id, roas: adSet.roas });
            this.log.info(`PAUSED ${adSet.id} — ROAS: ${adSet.roas.toFixed(2)}x`);
          }

          // ── SCALE WINNERS ──
          if (adSet.roas >= config.optimization.scaleThreshold && adSet.status === 'active') {
            const increase = campaign.budget.daily * (config.optimization.maxBudgetIncreasePercent / 100);
            campaign.budget.daily += increase;
            actions.push({
              type: 'scale',
              adSetId: adSet.id,
              roas: adSet.roas,
              newDailyBudget: campaign.budget.daily,
            });
            this.log.info(`SCALED ${adSet.id} — ROAS: ${adSet.roas.toFixed(2)}x, new budget: $${campaign.budget.daily.toFixed(2)}`);
          }
        }
      }

      // If there are actions, use local LLM to sanity-check
      if (actions.length > 0) {
        const prompt = `Review these automated ad optimization actions and flag any concerns:
${JSON.stringify(actions, null, 2)}

Active campaigns: ${activeCampaigns.length}
Total daily budget: $${activeCampaigns.reduce((s, c) => s + c.budget.daily, 0).toFixed(2)}

Respond: { "approved": boolean, "concerns": [], "suggestions": [] }`;

        const review = await queryLocal(prompt);
        return { actions, review: review?.response };
      }

      return { actions, message: 'No actions needed' };
    });
  }

  /**
   * Tier 3: Daily Opus strategic review.
   * Makes high-level budget allocation and strategy decisions.
   */
  async dailyOpusReview() {
    return this.run('dailyOpusReview', async () => {
      const campaigns = this.state.campaigns;
      const insights = this.state.insights;
      const research = insights?.latestResearch;

      const prompt = `DAILY STRATEGIC REVIEW — AdClaw Autonomous Ad Agency

## Current State
- Active campaigns: ${campaigns.filter((c) => c.status === 'active').length}
- Total campaigns: ${campaigns.length}
- Business niche: ${insights?.niche || 'unknown'}

## Campaign Performance (last 24h)
${JSON.stringify(
  campaigns.map((c) => ({
    id: c.id,
    status: c.status,
    budget: c.budget,
    adSets: c.adSets.map((a) => ({
      id: a.id,
      status: a.status,
      spend: a.spend,
      roas: a.roas,
      conversions: a.conversions,
    })),
  })),
  null,
  2
)}

## Latest Research
${research ? JSON.stringify(research.data).slice(0, 2000) : 'No recent research'}

## Compliance Flags
${JSON.stringify(this.state.complianceFlags)}

Make strategic decisions:
1. Should we reallocate budget between campaigns?
2. Should we launch new creative angles?
3. Are there audience segments to test?
4. Any campaigns to kill entirely?
5. Overall strategy adjustment?

Respond with JSON: { "decision": "", "reasoning": "", "actions": [], "confidence": 0.0 }`;

      const result = await queryOpus(prompt);

      if (result) {
        this.state.dailyReport = {
          ...(this.state.dailyReport || {}),
          opusReview: {
            response: result.response,
            at: new Date(),
          },
        };
      }

      return result;
    });
  }
}
