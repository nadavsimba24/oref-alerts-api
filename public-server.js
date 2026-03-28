// שרת ציבורי להתראות פיקוד העורף עם OpenClaw integration
const http = require('http');
const https = require('https');

const PORT = 3001;
let publicUrl = null;

// פונקציה לקבלת התראות מפיקוד העורף
async function getOrefAlerts() {
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
          if (data.trim() === '' || data.includes('<!DOCTYPE')) {
            resolve({ 
              alert: false, 
              data: [],
              timestamp: new Date().toISOString(),
              source: 'oref.org.il',
              status: 'no_alerts'
            });
          } else {
            const parsed = JSON.parse(data);
            resolve({ 
              alert: parsed.data && parsed.data.length > 0,
              data: parsed.data || [],
              id: parsed.id || Date.now(),
              title: parsed.title || 'התרעות פיקוד העורף',
              timestamp: new Date().toISOString(),
              source: 'oref.org.il',
              status: 'success'
            });
          }
        } catch (error) {
          resolve({ 
            alert: false, 
            data: [], 
            error: error.message,
            timestamp: new Date().toISOString(),
            source: 'oref.org.il',
            status: 'parse_error'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ 
        alert: false, 
        data: [], 
        error: error.message,
        timestamp: new Date().toISOString(),
        source: 'oref.org.il',
        status: 'connection_error'
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ 
        alert: false, 
        data: [], 
        error: 'Timeout',
        timestamp: new Date().toISOString(),
        source: 'oref.org.il',
        status: 'timeout'
      });
    });

    req.end();
  });
}

// צור שרת
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  
  // Health check
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Oref Alerts API',
      version: '2.0.0',
      public_url: publicUrl || 'לא הוגדר',
      endpoints: {
        health: '/health',
        current_alerts: '/api/alerts/current',
        test_data: '/api/alerts/test',
        info: '/api/info'
      },
      note: 'השרת רץ מקומית. כדי לגשת מרחוק, השתמש ב-OpenClaw או ngrok'
    }));
    return;
  }
  
  // Current alerts
  if (req.url === '/api/alerts/current') {
    try {
      const alerts = await getOrefAlerts();
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, max-age=30'
      });
      res.end(JSON.stringify(alerts));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
    return;
  }
  
  // Test data
  if (req.url === '/api/alerts/test') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({ 
      alert: true,
      data: ['תל אביב - מרכז (דוגמה)', 'ירושלים (דוגמה)', 'חיפה (דוגמה)'],
      id: Date.now(),
      title: 'התרעות פיקוד העורף - דוגמה',
      timestamp: new Date().toISOString(),
      note: 'זו דוגמה - כשהשרת האמיתי יעבוד, זה יוחלף בנתונים אמיתיים',
      regions: {
        'מרכז': ['תל אביב - מרכז (דוגמה)'],
        'צפון': ['חיפה (דוגמה)'],
        'ירושלים': ['ירושלים (דוגמה)']
      }
    }));
    return;
  }
  
  // API info
  if (req.url === '/api/info') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({
      name: 'Oref Alerts API',
      description: 'שירות להתראות פיקוד העורף בזמן אמת',
      version: '2.0.0',
      author: 'OpenClaw Assistant',
      repository: 'https://github.com/openclaw/openclaw',
      endpoints: [
        { path: '/health', method: 'GET', description: 'בדיקת בריאות' },
        { path: '/api/alerts/current', method: 'GET', description: 'התראות נוכחיות' },
        { path: '/api/alerts/test', method: 'GET', description: 'נתוני בדיקה' },
        { path: '/api/info', method: 'GET', description: 'מידע על ה-API' }
      ],
      usage: {
        javascript: "fetch('http://localhost:3001/api/alerts/current').then(r => r.json())",
        python: "requests.get('http://localhost:3001/api/alerts/current').json()",
        curl: "curl http://localhost:3001/api/alerts/current"
      },
      notes: [
        'השירות מתבסס על המידע הציבורי של פיקוד העורף',
        'מומלץ לא לשאול יותר מפעם ב-30 שניות',
        'יש caching מובנה למניעת עומס על השרתים'
      ]
    }));
    return;
  }
  
  // 404
  res.writeHead(404, { 
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify({ 
    error: 'Not found', 
    path: req.url,
    timestamp: new Date().toISOString(),
    suggestion: 'נסה /health או /api/alerts/current'
  }));
});

// הרץ את השרת
server.listen(PORT, '0.0.0.0', () => {
  const addresses = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://[::1]:${PORT}`
  ];
  
  // ננסה לקבל את ה-IP המקומי
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  Object.keys(interfaces).forEach((ifname) => {
    interfaces[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      addresses.push(`http://${iface.address}:${PORT}`);
    });
  });
  
  console.log('='.repeat(60));
  console.log('🚀 ORED ALERTS API - שרת התראות פיקוד העורף');
  console.log('='.repeat(60));
  console.log('\n📡 כתובות גישה מקומיות:');
  addresses.forEach(addr => console.log(`  • ${addr}`));
  
  console.log('\n🔗 Endpoints זמינים:');
  console.log('  • /health           - בדיקת בריאות');
  console.log('  • /api/alerts/current - התראות נוכחיות');
  console.log('  • /api/alerts/test    - נתוני בדיקה');
  console.log('  • /api/info          - מידע על ה-API');
  
  console.log('\n🌐 כדי לגשת מרחוק:');
  console.log('  1. התקן ngrok: brew install ngrok');
  console.log('  2. הרץ: ngrok http 3001');
  console.log('  3. קבל כתובת ציבורית כמו: https://abc123.ngrok.io');
  
  console.log('\n📱 או השתמש ב-OpenClaw ליצירת endpoint ציבורי:');
  console.log('  openclaw gateway --public');
  
  console.log('\n⚡ דוגמת שימוש:');
  console.log('  curl http://localhost:3001/api/alerts/current');
  console.log('  curl http://localhost:3001/api/alerts/test');
  console.log('='.repeat(60));
  
  // ננסה לקבל כתובת ציבורית דרך שירות חיצוני
  try {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          publicUrl = `http://${ip}:${PORT}`;
          console.log(`\n🌍 כתובת IP ציבורית משוערת: ${publicUrl}`);
          console.log('⚠️  ייתכן שתצטרך לפתוח פורט בפיירוול');
        } catch (e) {}
      });
    }).on('error', () => {});
  } catch (e) {}
});

// טיפול בסגירה
process.on('SIGTERM', () => {
  console.log('\n🔴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🔴 Ctrl+C pressed, shutting down');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});