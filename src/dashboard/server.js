import express from 'express';
import os from 'os';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../config/defaults.js';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'index.html');
const dashboardHtml = existsSync(htmlPath)
  ? readFileSync(htmlPath, 'utf-8')
  : '<html><body><h1>Dashboard</h1><p>Not available in serverless mode.</p></body></html>';

/**
 * Resource monitoring dashboard for Mac Mini fleet.
 * Serves a lightweight HTML dashboard + JSON API.
 */

let swarmManager = null;

export function setSwarmManager(manager) {
  swarmManager = manager;
}

export function createDashboardApp() {
  const app = express();

  // ── JSON API ──────────────────────────────────────────────────────

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
  });

  app.get('/api/system', (req, res) => {
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

  app.get('/api/swarms', (req, res) => {
    if (!swarmManager) {
      return res.json({ swarms: [], message: 'Swarm manager not initialized' });
    }
    res.json({
      swarms: swarmManager.getAll().map((s) => s.getStatus()),
      maxConcurrent: config.resources.maxConcurrentSwarms,
    });
  });

  app.get('/api/swarms/:id', (req, res) => {
    if (!swarmManager) return res.status(503).json({ error: 'Not ready' });
    const swarm = swarmManager.get(req.params.id);
    if (!swarm) return res.status(404).json({ error: 'Swarm not found' });
    res.json(swarm.getStatus());
  });

  // ── Dashboard HTML ────────────────────────────────────────────────

  app.get('/', (req, res) => {
    res.type('html').send(dashboardHtml);
  });

  return app;
}

// Start standalone if run directly
const isMainModule = process.argv[1]?.endsWith('dashboard/server.js');
if (isMainModule) {
  const app = createDashboardApp();
  const port = config.dashboardPort;
  app.listen(port, () => {
    logger.info('Dashboard running at http://localhost:' + port);
  });
}
