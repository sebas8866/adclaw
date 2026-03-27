import express from 'express';
import os from 'os';
import { metaAuthRoutes } from '../integrations/meta-oauth.js';
import { handleWebhook } from '../integrations/stripe-billing.js';
import { logger } from '../utils/logger.js';

export function createApiRouter(swarmManager) {
  const router = express.Router();

  // ── System Info (used by dashboard) ─────────────────────────────

  router.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
  });

  router.get('/system', (req, res) => {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    res.json({
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpuCores: cpus.length,
      cpuModel: cpus[0]?.model,
      cpuUsagePercent: cpuUsage.toFixed(1),
      memoryTotalMb: Math.round(totalMem / 1024 / 1024),
      memoryUsedMb: Math.round((totalMem - freeMem) / 1024 / 1024),
      memoryUsagePercent: (((totalMem - freeMem) / totalMem) * 100).toFixed(1),
      nodeVersion: process.version,
      processMemoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    });
  });

  // ── Swarm Management ──────────────────────────────────────────────

  /**
   * POST /api/swarms/launch
   * Body: { clientId, businessPageUrl, metaAccessToken, googleAccessToken? }
   */
  router.post('/swarms/launch', async (req, res) => {
    try {
      const { clientId, businessPageUrl, metaAccessToken, metaAdAccountId, googleAccessToken } = req.body;

      if (!clientId || !businessPageUrl) {
        return res.status(400).json({ error: 'clientId and businessPageUrl are required' });
      }

      const resolvedMetaToken = metaAccessToken === '__cookie__'
        ? req.cookies?.meta_access_token
        : metaAccessToken;

      const resolvedAdAccount = metaAdAccountId || req.cookies?.meta_ad_account_id || null;

      const swarm = await swarmManager.launch({
        clientId,
        businessPageUrl,
        metaAccessToken: resolvedMetaToken || null,
        metaAdAccountId: resolvedAdAccount,
        googleAccessToken,
      });

      res.status(201).json({
        swarmId: swarm.id,
        status: swarm.status,
        message: 'Swarm launched — agent fleet initializing',
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/swarms', (req, res) => {
    res.json(swarmManager.getStats());
  });

  router.get('/swarms/:id', (req, res) => {
    const swarm = swarmManager.get(req.params.id);
    if (!swarm) return res.status(404).json({ error: 'Swarm not found' });
    res.json(swarm.getStatus());
  });

  router.post('/swarms/:id/stop', async (req, res) => {
    try {
      await swarmManager.stop(req.params.id);
      res.json({ message: 'Swarm stopped' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/swarms/:id/report
   * Returns the latest daily report for a swarm.
   */
  router.get('/swarms/:id/report', (req, res) => {
    const swarm = swarmManager.get(req.params.id);
    if (!swarm) return res.status(404).json({ error: 'Swarm not found' });

    const report = swarm.state.dailyReport;
    if (!report) return res.json({ message: 'No report generated yet' });
    res.json(report);
  });

  /**
   * POST /api/swarms/:id/creative/generate
   * Trigger new creative generation for a swarm.
   */
  router.post('/swarms/:id/creative/generate', async (req, res) => {
    const swarm = swarmManager.get(req.params.id);
    if (!swarm) return res.status(404).json({ error: 'Swarm not found' });

    try {
      const creatives = await swarm.agents.creative.generateInitialSet(swarm.state.insights);
      res.json({ creatives: creatives.length, data: creatives });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Data Deletion ───────────────────────────────────────────────

  router.post('/data-deletion', (req, res) => {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const confirmationCode = 'DEL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    logger.info(`Data deletion request: ${email} — code: ${confirmationCode} — reason: ${reason || 'none'}`);

    res.json({ confirmationCode, message: 'Deletion request received. We will process within 30 days.' });
  });

  router.post('/data-deletion/facebook', (req, res) => {
    const signed_request = req.body.signed_request;
    const confirmationCode = 'FB-DEL-' + Date.now().toString(36).toUpperCase();
    logger.info(`Facebook data deletion callback received — code: ${confirmationCode}`);

    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');

    res.json({
      url: `${proto}://${host}/data-deletion?code=${confirmationCode}`,
      confirmation_code: confirmationCode,
    });
  });

  // ── Stripe Webhook ────────────────────────────────────────────────

  router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const event = await handleWebhook(req.body, req.headers['stripe-signature']);
      res.json({ received: true, type: event.type });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
