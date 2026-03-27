import express from 'express';
import { homePage } from '../frontend/home.js';
import { appDashboardPage } from '../frontend/app-dashboard.js';
import { launchPage } from '../frontend/launch.js';
import { swarmsPage, swarmDetailPage } from '../frontend/swarms.js';
import { loginPage, signupPage } from '../frontend/auth.js';
import { privacyPage, termsPage, dataDeletionPage } from '../frontend/legal.js';
import { requireAuth } from '../auth/middleware.js';

export function createFrontendRouter() {
  const router = express.Router();

  router.get('/auth/login', (req, res) => {
    res.type('html').send(loginPage());
  });

  router.get('/auth/signup', (req, res) => {
    res.type('html').send(signupPage());
  });

  router.get('/auth/logout', (req, res) => {
    res.clearCookie('sb_access_token');
    res.clearCookie('sb_refresh_token');
    res.redirect('/');
  });

  router.get('/', (req, res) => {
    const isLoggedIn = !!(req.cookies?.sb_access_token || req.cookies?.sb_refresh_token);
    res.type('html').send(homePage({ isLoggedIn }));
  });

  router.get('/privacy', (req, res) => {
    res.type('html').send(privacyPage());
  });

  router.get('/terms', (req, res) => {
    res.type('html').send(termsPage());
  });

  router.get('/data-deletion', (req, res) => {
    res.type('html').send(dataDeletionPage());
  });

  router.use(requireAuth);

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
