import axios from 'axios';
import { logger } from '../utils/logger.js';

const META_GRAPH_URL = 'https://graph.facebook.com/v21.0';

export class MetaAdsClient {
  constructor({ accessToken, adAccountId }) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
  }

  get headers() {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

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
    return res.data;
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
    return res.data;
  }

  static async getMe(accessToken) {
    const res = await axios.get(`${META_GRAPH_URL}/me`, {
      params: { fields: 'id,name', access_token: accessToken },
    });
    return res.data;
  }

  async getAdAccounts() {
    const res = await axios.get(`${META_GRAPH_URL}/me/adaccounts`, {
      headers: this.headers,
      params: { fields: 'id,name,account_status,currency,timezone_name' },
    });
    return res.data.data;
  }

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

  async createAdSet({ campaignId, name, dailyBudget, targeting, startTime }) {
    const res = await axios.post(
      `${META_GRAPH_URL}/act_${this.adAccountId}/adsets`,
      {
        campaign_id: campaignId,
        name,
        daily_budget: Math.round(dailyBudget * 100),
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

  async getPageInfo(pageId) {
    const res = await axios.get(`${META_GRAPH_URL}/${pageId}`, {
      headers: this.headers,
      params: { fields: 'id,name,category,about,fan_count,website' },
    });
    return res.data;
  }
}

function getRedirectUri(req) {
  if (process.env.META_REDIRECT_URI) return process.env.META_REDIRECT_URI;
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${proto}://${host}/auth/meta/callback`;
}

export function metaAuthRoutes(app) {
  app.get('/auth/meta', (req, res) => {
    const appId = process.env.META_APP_ID;
    if (!appId) {
      return res.redirect('/app/launch?meta=error&reason=not_configured');
    }

    const redirectUri = getRedirectUri(req);
    const state = Buffer.from(JSON.stringify({ ts: Date.now(), redirect: redirectUri })).toString('base64');

    const url = MetaAdsClient.getAuthUrl({ appId, redirectUri, state });
    res.redirect(url);
  });

  app.get('/auth/meta/callback', async (req, res) => {
    const { code, error_reason } = req.query;

    if (error_reason || !code) {
      return res.redirect('/app/launch?meta=error&reason=' + encodeURIComponent(error_reason || 'no_code'));
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = getRedirectUri(req);

    try {
      const shortToken = await MetaAdsClient.exchangeCode({ code, appId, appSecret, redirectUri });

      let accessToken = shortToken.access_token;
      try {
        const longToken = await MetaAdsClient.getLongLivedToken({ shortToken: accessToken, appId, appSecret });
        accessToken = longToken.access_token;
      } catch (e) {
        logger.warn('Could not get long-lived token, using short-lived: ' + e.message);
      }

      const me = await MetaAdsClient.getMe(accessToken);

      res.cookie('meta_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
        sameSite: 'lax',
        maxAge: 60 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.cookie('meta_user_name', me.name || 'Connected', {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      logger.info(`Meta OAuth complete for ${me.name} (${me.id})`);
      res.redirect('/app/launch?meta=success&name=' + encodeURIComponent(me.name || ''));
    } catch (err) {
      logger.error(`Meta OAuth failed: ${err.message}`);
      res.redirect('/app/launch?meta=error&reason=' + encodeURIComponent(err.message));
    }
  });

  app.get('/api/meta/status', (req, res) => {
    const token = req.cookies?.meta_access_token;
    const name = req.cookies?.meta_user_name;
    if (token) {
      res.json({ connected: true, name: name || 'Connected' });
    } else {
      res.json({ connected: false });
    }
  });

  app.post('/api/meta/disconnect', (req, res) => {
    res.clearCookie('meta_access_token');
    res.clearCookie('meta_user_name');
    res.json({ disconnected: true });
  });
}
