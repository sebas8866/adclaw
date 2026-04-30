import express from 'express';
import { homePage } from '../frontend/home.js';
import { appDashboardPage } from '../frontend/app-dashboard.js';
import { launchPage } from '../frontend/launch.js';
import { swarmsPage, swarmDetailPage } from '../frontend/swarms.js';

export function createFrontendRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.type('html').send(homePage());
  });

  router.get('/app', (req, res) => {
    res.type('html').send(appDashboardPage());
  });

  router.get('/app/launch', (req, res) => {
    res.type('html').send(launchPage());
  });

  router.get('/app/swarms', (req, res) => {
    res.type('html').send(swarmsPage());
  });

  router.get('/app/swarms/:id', (req, res) => {
    res.type('html').send(swarmDetailPage(req.params.id));
  });

  return router;
}
