import axios from 'axios';
import { logger } from '../utils/logger.js';

const META_GRAPH_URL = 'https://graph.facebook.com/v21.0';

/**
 * Meta Ads OAuth & API integration.
 *
 * Required scopes:
 *   - ads_management
 *   - ads_read
 *   - pages_read_engagement
 *   - business_management
 */
export class MetaAdsClient {
  constructor({ accessToken, adAccountId }) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
  }

  get headers() {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  // ── OAuth Flow Helpers ──────────────────────────────────────────

  static getAuthUrl({ appId, redirectUri, state }) {
    const scopes = [
      'ads_management',
      'ads_read',
      'pages_read_engagement',
      'business_management',
    ].join(',');

    return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}&response_type=code`;
  }

  static async exchangeCode({ code, appId, appSecret, redirectUri }) {
    const res = await axios.get(`${META_GRAPH_URL}/oauth/access_token`, {
      params: {
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      },
    });
    return res.data; // { access_token, token_type, expires_in }
  }

  static async getLongLivedToken({ shortToken, appId, appSecret }) {
    const res = await axios.get(`${META_GRAPH_URL}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortToken,
      },
    });
    return res.data; // { access_token, token_type, expires_in }
  }

  // ── Ad Account ──────────────────────────────────────────────────

  async getAdAccounts() {
    const res = await axios.get(`${META_GRAPH_URL}/me/adaccounts`, {
      headers: this.headers,
      params: { fields: 'id,name,account_status,currency,timezone_name' },
    });
    return res.data.data;
  }

  // ── Campaign CRUD ───────────────────────────────────────────────

  async createCampaign({ name, objective = 'OUTCOME_SALES', status = 'PAUSED', specialAdCategories = [] }) {
    const res = await axios.post(
      `${META_GRAPH_URL}/act_${this.adAccountId}/campaigns`,
      { name, objective, status, special_ad_categories: specialAdCategories },
      { headers: this.headers }
    );
    return res.data;
  }

  async getCampaigns() {
    const res = await axios.get(
      `${META_GRAPH_URL}/act_${this.adAccountId}/campaigns`,
      {
        headers: this.headers,
        params: {
          fields: 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time',
        },
      }
    );
    return res.data.data;
  }

  async updateCampaignStatus(campaignId, status) {
    const res = await axios.post(
      `${META_GRAPH_URL}/${campaignId}`,
      { status },
      { headers: this.headers }
    );
    return res.data;
  }

  // ── Ad Set CRUD ─────────────────────────────────────────────────

  async createAdSet({ campaignId, name, dailyBudget, targeting, startTime }) {
    const res = await axios.post(
      `${META_GRAPH_URL}/act_${this.adAccountId}/adsets`,
      {
        campaign_id: campaignId,
        name,
        daily_budget: Math.round(dailyBudget * 100), // cents
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'OFFSITE_CONVERSIONS',
        targeting,
        start_time: startTime || new Date().toISOString(),
        status: 'ACTIVE',
      },
      { headers: this.headers }
    );
    return res.data;
  }

  // ── Insights ────────────────────────────────────────────────────

  async getInsights(objectId, { datePreset = 'last_7d', level = 'ad' } = {}) {
    const res = await axios.get(`${META_GRAPH_URL}/${objectId}/insights`, {
      headers: this.headers,
      params: {
        fields: 'spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,purchase_roas',
        date_preset: datePreset,
        level,
      },
    });
    return res.data.data;
  }

  // ── Page Info ───────────────────────────────────────────────────

  async getPageInfo(pageId) {
    const res = await axios.get(`${META_GRAPH_URL}/${pageId}`, {
      headers: this.headers,
      params: { fields: 'id,name,category,about,fan_count,website' },
    });
    return res.data;
  }
}

// ── Express Route Handlers ──────────────────────────────────────────

export function metaAuthRoutes(app) {
  app.get('/auth/meta', (req, res) => {
    const state = Buffer.from(JSON.stringify({ ts: Date.now() })).toString('base64');
    const url = MetaAdsClient.getAuthUrl({
      appId: process.env.META_APP_ID,
      redirectUri: process.env.META_REDIRECT_URI,
      state,
    });
    res.redirect(url);
  });

  app.get('/auth/meta/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    try {
      // Exchange code for short-lived token
      const shortToken = await MetaAdsClient.exchangeCode({
        code,
        appId: process.env.META_APP_ID,
        appSecret: process.env.META_APP_SECRET,
        redirectUri: process.env.META_REDIRECT_URI,
      });

      // Exchange for long-lived token (60 days)
      const longToken = await MetaAdsClient.getLongLivedToken({
        shortToken: shortToken.access_token,
        appId: process.env.META_APP_ID,
        appSecret: process.env.META_APP_SECRET,
      });

      logger.info('Meta OAuth complete — long-lived token obtained');

      // TODO: Store token securely (encrypted in DB)
      res.json({
        success: true,
        expiresIn: longToken.expires_in,
        message: 'Meta Ads connected successfully',
      });
    } catch (err) {
      logger.error(`Meta OAuth failed: ${err.message}`);
      res.status(500).json({ error: 'OAuth failed', detail: err.message });
    }
  });
}
