import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/defaults.js';
import { SwarmManager } from './core/swarm-manager.js';
import { createApiRouter } from './routes/api.js';
import { createFrontendRouter } from './routes/frontend.js';
import { metaAuthRoutes } from './integrations/meta-oauth.js';
import { createDashboardApp, setSwarmManager } from './dashboard/server.js';
import { logger } from './utils/logger.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/media', express.static(path.resolve(__dirname, '../public/media')));

// Initialize swarm manager
const swarmManager = new SwarmManager();

// Wire up API routes
app.use('/api', createApiRouter(swarmManager));
metaAuthRoutes(app);

// Mount system monitoring dashboard (legacy)
const dashboardApp = createDashboardApp();
setSwarmManager(swarmManager);
app.use('/monitoring', dashboardApp);

// Mount frontend pages (home, app, launch, swarms)
app.use('/', createFrontendRouter());

// ── Start Server ────────────────────────────────────────────────────

const port = config.apiPort;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    logger.info(`AdClaw v0.1.0 — http://localhost:${port}`);
  });
}

export default app;
export { app, swarmManager };
