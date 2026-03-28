import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { OrefService } from './services/oref.service';
import { CacheService } from './services/cache.service';
import { Logger } from './utils/logger';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize services
const logger = new Logger();
const cacheService = new CacheService();
const orefService = new OrefService(cacheService, logger);

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/alerts/current', async (req, res) => {
  try {
    const alerts = await orefService.getCurrentAlerts();
    res.json(alerts);
  } catch (error) {
    logger.error('Failed to fetch current alerts', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.get('/api/alerts/history', async (req, res) => {
  try {
    const history = await orefService.getAlertHistory();
    res.json(history);
  } catch (error) {
    logger.error('Failed to fetch alert history', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.get('/api/alerts/cities', async (req, res) => {
  try {
    const cities = await orefService.getCitiesWithAlerts();
    res.json(cities);
  } catch (error) {
    logger.error('Failed to fetch cities', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// WebSocket for live alerts
wss.on('connection', (ws) => {
  logger.info('New WebSocket connection');
  
  // Send initial state
  orefService.getCurrentAlerts().then(alerts => {
    ws.send(JSON.stringify({ type: 'initial', data: alerts }));
  });

  // Set up polling for updates
  const interval = setInterval(async () => {
    try {
      const alerts = await orefService.getCurrentAlerts();
      ws.send(JSON.stringify({ type: 'update', data: alerts }));
    } catch (error) {
      logger.error('WebSocket update error', error);
    }
  }, 5000); // Poll every 5 seconds

  ws.on('close', () => {
    clearInterval(interval);
    logger.info('WebSocket connection closed');
  });
});

// Start server - listen on all interfaces for Docker/Render
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Oref Alerts API running on port ${PORT}`);
  logger.info(`📡 WebSocket available at ws://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});