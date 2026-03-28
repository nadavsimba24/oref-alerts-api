"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const http_1 = require("http");
const ws_1 = require("ws");
const oref_service_1 = require("./services/oref.service");
const cache_service_1 = require("./services/cache.service");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
// Initialize services
const logger = new logger_1.Logger();
const cacheService = new cache_service_1.CacheService();
const orefService = new oref_service_1.OrefService(cacheService, logger);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.get('/api/alerts/current', async (req, res) => {
    try {
        const alerts = await orefService.getCurrentAlerts();
        res.json(alerts);
    }
    catch (error) {
        logger.error('Failed to fetch current alerts', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});
app.get('/api/alerts/history', async (req, res) => {
    try {
        const history = await orefService.getAlertHistory();
        res.json(history);
    }
    catch (error) {
        logger.error('Failed to fetch alert history', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});
app.get('/api/alerts/cities', async (req, res) => {
    try {
        const cities = await orefService.getCitiesWithAlerts();
        res.json(cities);
    }
    catch (error) {
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
        }
        catch (error) {
            logger.error('WebSocket update error', error);
        }
    }, 5000); // Poll every 5 seconds
    ws.on('close', () => {
        clearInterval(interval);
        logger.info('WebSocket connection closed');
    });
});
// Start server
server.listen(PORT, () => {
    logger.info(`🚀 Oref Alerts API running on port ${PORT}`);
    logger.info(`📡 WebSocket available at ws://localhost:${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=index.js.map