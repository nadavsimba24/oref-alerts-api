// שרת בדיקה פשוט להתראות פיקוד העורף
const http = require('http');
const https = require('https');

const PORT = 3001;

// פונקציה לקבלת התראות מפיקוד העורף
function getOrefAlerts() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.oref.org.il',
      port: 443,
      path: '/WarningMessages/alert/alerts.json',
      method: 'GET',
      headers: {
        'User-Agent': 'https://www.oref.org.il/',
        'Referer': 'https://www.oref.org.il//12481-he/Pakar.aspx',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (data.trim() === '') {
            resolve({ alert: false, data: [] });
          } else {
            const parsed = JSON.parse(data);
            resolve({ 
              alert: parsed.data && parsed.data.length > 0,
              data: parsed.data || [],
              id: parsed.id,
              title: parsed.title
            });
          }
        } catch (error) {
          resolve({ alert: false, data: [], error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ alert: false, data: [], error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ alert: false, data: [], error: 'Timeout' });
    });

    req.end();
  });
}

// צור שרת
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Oref Alerts API',
      version: '1.0.0'
    }));
    return;
  }
  
  if (req.url === '/api/alerts/current') {
    try {
      const alerts = await getOrefAlerts();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(alerts));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  
  if (req.url === '/api/alerts/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      alert: true,
      data: ['תל אביב - מרכז (דוגמה)', 'ירושלים (דוגמה)'],
      id: Date.now(),
      title: 'התרעות פיקוד העורף - דוגמה',
      note: 'זו דוגמה - כשהשרת האמיתי יעבוד, זה יוחלף בנתונים אמיתיים'
    }));
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', path: req.url }));
});

// הרץ את השרת
server.listen(PORT, () => {
  console.log(`🚀 Oref Alerts API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Current alerts: http://localhost:${PORT}/api/alerts/current`);
  console.log(`📡 Test data: http://localhost:${PORT}/api/alerts/test`);
  console.log('\n📱 כדי לגשת מרחוק:');
  console.log('1. התקן ngrok: brew install ngrok');
  console.log('2. הרץ: ngrok http 3000');
  console.log('3. קבל כתובת ציבורית');
});

// טיפול בסגירה
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});