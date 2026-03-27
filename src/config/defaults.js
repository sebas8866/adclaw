export const config = {
  // Intelligence tiers — escalation thresholds
  intelligence: {
    local: {
      intervalMs: 15 * 60 * 1000,       // 15 minutes
      model: process.env.OLLAMA_MODEL || 'llama3.2:3b',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    },
    kimi: {
      intervalMs: 60 * 60 * 1000,       // 1 hour
      baseUrl: process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1',
      model: 'moonshot-v1-128k',
    },
    opus: {
      intervalMs: 24 * 60 * 60 * 1000,  // 24 hours
      model: 'claude-opus-4-6',
    },
  },

  // Campaign optimization rules
  optimization: {
    roasFloor: parseFloat(process.env.ROAS_FLOOR) || 2.5,
    scaleThreshold: parseFloat(process.env.SCALE_ROAS_THRESHOLD) || 4.0,
    minSpendBeforeDecision: 20,      // USD — don't judge before $20 spent
    learningPhaseDays: 3,
    maxBudgetIncreasePercent: 30,     // per scale event
    pauseCooldownHours: 6,
  },

  // Swarm resource limits per Mac Mini
  resources: {
    maxConcurrentSwarms: parseInt(process.env.MAX_CONCURRENT_SWARMS) || 4,
    maxMemoryPerSwarmMb: 512,
    cpuAlertThreshold: 85,           // percent
  },

  // Creative defaults
  creative: {
    defaultWidth: 1080,
    defaultHeight: 1080,
    maxVariations: 5,
    formats: ['square', 'story', 'landscape'],
  },

  // Server
  apiPort: parseInt(process.env.API_PORT) || 3000,
  dashboardPort: parseInt(process.env.DASHBOARD_PORT) || 3001,
};
