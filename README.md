# Oref Alerts API 🚨

Modern API for Israel Home Front Command (Pikud HaOref) alerts with WebSocket support.

## Features ✨

- **Real-time alerts** via WebSocket
- **Caching** to reduce API calls
- **TypeScript** for type safety
- **Rate limiting** protection
- **Comprehensive logging**
- **Health monitoring**
- **City/region grouping**

## Installation 📦

```bash
# Clone the repository
git clone <your-repo-url>
cd oref-api

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# For development
npm run dev
```

## API Endpoints 🌐

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### `GET /api/alerts/current`
Get current alerts.

**Response:**
```json
{
  "alert": true,
  "current": {
    "data": ["תל אביב - מרכז", "ירושלים"],
    "id": 1704067200000,
    "title": "התרעות פיקוד העורף"
  }
}
```

### `GET /api/alerts/history`
Get alert history (last 24 hours).

**Response:**
```json
{
  "lastDay": [
    {
      "data": "תל אביב",
      "date": "01.01.2024",
      "time": "12:00",
      "datetime": "2024-01-01T12:00:00"
    }
  ]
}
```

### `GET /api/alerts/cities`
Get list of cities with current alerts.

**Response:**
```json
["תל אביב - מרכז", "ירושלים"]
```

### `GET /api/alerts/regions`
Get alerts grouped by region.

**Response:**
```json
{
  "מרכז": ["תל אביב - מרכז", "רמת גן"],
  "ירושלים והסביבה": ["ירושלים"],
  "חיפה והצפון": ["חיפה"],
  "דרום": ["באר שבע"],
  "שפלה": ["אשדוד"],
  "אחר": ["עיר אחרת"]
}
```

## WebSocket Support 📡

Connect to `ws://localhost:3000` for real-time alerts.

**Message types:**
- `initial`: Initial state when connecting
- `update`: Periodic updates (every 5 seconds)

**Example WebSocket message:**
```json
{
  "type": "update",
  "data": {
    "alert": true,
    "current": {
      "data": ["תל אביב"],
      "id": 1704067200000,
      "title": "התרעות פיקוד העורף"
    }
  }
}
```

## Configuration ⚙️

### Environment Variables
```bash
PORT=3000
NODE_ENV=production
CACHE_TTL_CURRENT=30      # Cache current alerts for 30 seconds
CACHE_TTL_HISTORY=300     # Cache history for 5 minutes
```

### Rate Limiting
The API includes built-in rate limiting:
- 100 requests per minute per IP
- WebSocket connections limited to 10 per IP

## Docker Support 🐳

```bash
# Build the image
docker build -t oref-api .

# Run the container
docker run -p 3000:3000 oref-api

# With Docker Compose
docker-compose up
```

## Development 🛠️

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure 📁

```
src/
├── index.ts              # Main application entry point
├── services/
│   ├── oref.service.ts   # Oref API service
│   └── cache.service.ts  # Caching service
├── utils/
│   └── logger.ts         # Logging utility
└── middleware/
    └── rate-limit.ts     # Rate limiting middleware
```

## Error Handling 🚨

The API handles errors gracefully:
- **API timeouts**: Returns empty response after 10 seconds
- **Network errors**: Returns cached data if available
- **Invalid responses**: Returns default empty structure

## Monitoring 📊

### Health Checks
```bash
curl http://localhost:3000/health
```

### Metrics
- Request count
- Response times
- Cache hit rates
- WebSocket connections
- Error rates

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License 📄

MIT License - see LICENSE file for details.

## Support 💬

For issues and questions:
- Open a GitHub issue
- Check the documentation
- Contact the maintainers

---

**Note**: This API proxies requests to the official Pikud HaOref website. Please use responsibly and respect rate limits.