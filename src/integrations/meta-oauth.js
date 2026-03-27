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
      params: { fields: 'id,name,account_status,currency,timezone_name', limit: 100 },
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

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
  sameSite: 'lax',
  maxAge: 60 * 24 * 60 * 60 * 1000,
  path: '/',
};

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

      res.cookie('meta_access_token', accessToken, COOKIE_OPTS);
      res.cookie('meta_user_name', me.name || 'Connected', { maxAge: COOKIE_OPTS.maxAge, path: '/' });
      res.cookie('meta_user_id', me.id, { maxAge: COOKIE_OPTS.maxAge, path: '/' });

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
    const adAccountId = req.cookies?.meta_ad_account_id;
    const adAccountName = req.cookies?.meta_ad_account_name;
    if (token) {
      res.json({
        connected: true,
        name: name || 'Connected',
        adAccountId: adAccountId || null,
        adAccountName: adAccountName || null,
      });
    } else {
      res.json({ connected: false });
    }
  });

  app.get('/api/meta/ad-accounts', async (req, res) => {
    const token = req.cookies?.meta_access_token;
    if (!token) {
      return res.status(401).json({ error: 'Not connected to Meta' });
    }

    try {
      const client = new MetaAdsClient({ accessToken: token, adAccountId: null });
      const accounts = await client.getAdAccounts();

      const STATUS_MAP = { 1: 'Active', 2: 'Disabled', 3: 'Unsettled', 7: 'Pending review', 9: 'In grace period', 100: 'Pending closure', 101: 'Closed', 201: 'Any active', 202: 'Any closed' };

      res.json(accounts.map(a => ({
        id: a.id.replace('act_', ''),
        rawId: a.id,
        name: a.name || a.id,
        status: STATUS_MAP[a.account_status] || 'Unknown',
        statusCode: a.account_status,
        currency: a.currency,
        timezone: a.timezone_name,
      })));
    } catch (err) {
      logger.error('Failed to fetch ad accounts: ' + err.message);
      if (err.response?.status === 190) {
        res.clearCookie('meta_access_token');
        res.clearCookie('meta_user_name');
        return res.status(401).json({ error: 'Token expired — please reconnect' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/meta/select-account', (req, res) => {
    const token = req.cookies?.meta_access_token;
    if (!token) {
      return res.status(401).json({ error: 'Not connected to Meta' });
    }

    const { adAccountId, adAccountName } = req.body;
    if (!adAccountId) {
      return res.status(400).json({ error: 'adAccountId is required' });
    }

    res.cookie('meta_ad_account_id', adAccountId, { maxAge: COOKIE_OPTS.maxAge, path: '/' });
    res.cookie('meta_ad_account_name', adAccountName || adAccountId, { maxAge: COOKIE_OPTS.maxAge, path: '/' });
    res.json({ selected: true, adAccountId, adAccountName });
  });

  app.post('/api/meta/disconnect', (req, res) => {
    res.clearCookie('meta_access_token');
    res.clearCookie('meta_user_name');
    res.clearCookie('meta_user_id');
    res.clearCookie('meta_ad_account_id');
    res.clearCookie('meta_ad_account_name');
    res.json({ disconnected: true });
  });
}
