// Reverse Proxy פשוט שיעבוד דרך OpenClaw
const http = require('http');
const https = require('https');
const url = require('url');

const TARGET_PORT = 3001; // השרת המקורי
const PROXY_PORT = 8080;  // הפורט החיצוני

// יצירת proxy
const proxy = http.createServer((clientReq, clientRes) => {
  console.log(`[${new Date().toISOString()}] ${clientReq.method} ${clientReq.url} from ${clientReq.socket.remoteAddress}`);
  
  // הגדרות CORS
  clientRes.setHeader('Access-Control-Allow-Origin', '*');
  clientRes.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  clientRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (clientReq.method === 'OPTIONS') {
    clientRes.writeHead(200);
    clientRes.end();
    return;
  }
  
  // פרסור ה-URL
  const targetUrl = url.parse(`http://localhost:${TARGET_PORT}${clientReq.url}`);
  
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: targetUrl.path,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: `localhost:${TARGET_PORT}`,
      'x-forwarded-for': clientReq.socket.remoteAddress,
      'x-forwarded-proto': 'http'
    }
  };
  
  // יצירת בקשה לשרת המקורי
  const proxyReq = http.request(options, (proxyRes) => {
    // העתקת headers
    Object.keys(proxyRes.headers).forEach(key => {
      clientRes.setHeader(key, proxyRes.headers[key]);
    });
    
    // הוספת headers נוספים
    clientRes.setHeader('x-proxy-server', 'OpenClaw-Reverse-Proxy');
    clientRes.setHeader('x-original-server', `localhost:${TARGET_PORT}`);
    
    clientRes.writeHead(proxyRes.statusCode);
    
    // העברת הנתונים
    proxyRes.pipe(clientRes);
  });
  
  proxyReq.on('error', (err) => {
    console.error(`Proxy error: ${err.message}`);
    clientRes.writeHead(502, { 'Content-Type': 'application/json' });
    clientRes.end(JSON.stringify({
      error: 'Bad Gateway',
      message: err.message,
      timestamp: new Date().toISOString()
    }));
  });
  
  // העברת body אם יש
  if (['POST', 'PUT', 'PATCH'].includes(clientReq.method)) {
    clientReq.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
});

// הרצת ה-proxy
proxy.listen(PROXY_PORT, '0.0.0.0', () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  console.log('='.repeat(70));
  console.log('🔀 REVERSE PROXY FOR ORED ALERTS API');
  console.log('='.repeat(70));
  console.log(`\n🎯 Target server: http://localhost:${TARGET_PORT}`);
  console.log(`🌐 Proxy listening on: 0.0.0.0:${PROXY_PORT}`);
  
  console.log('\n📡 כתובות גישה:');
  console.log(`  • http://localhost:${PROXY_PORT}`);
  console.log(`  • http://127.0.0.1:${PROXY_PORT}`);
  
  // הצגת כתובות רשת
  Object.keys(interfaces).forEach((ifname) => {
    interfaces[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      console.log(`  • http://${iface.address}:${PROXY_PORT}`);
    });
  });
  
  console.log('\n🔗 Endpoints (מתועלים דרך proxy):');
  console.log(`  • http://localhost:${PROXY_PORT}/health`);
  console.log(`  • http://localhost:${PROXY_PORT}/api/alerts/current`);
  console.log(`  • http://localhost:${PROXY_PORT}/api/alerts/test`);
  console.log(`  • http://localhost:${PROXY_PORT}/api/info`);
  
  console.log('\n⚡ דוגמת שימוש:');
  console.log(`  curl http://localhost:${PROXY_PORT}/api/alerts/current`);
  console.log(`  curl http://YOUR_IP:${PROXY_PORT}/api/alerts/current`);
  
  console.log('\n⚠️  הערות:');
  console.log('  1. Proxy זה מאזין על 0.0.0.0 (כל הרשת)');
  console.log('  2. ייתכן שתצטרך לפתוח פורט בפיירוול');
  console.log('  3. הנתונים מתועלים לשרת המקורי בפורט 3001');
  console.log('='.repeat(70));
  
  // ננסה לקבל IP ציבורי
  try {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          console.log(`\n🌍 כתובת IP ציבורית משוערת: http://${ip}:${PROXY_PORT}`);
          console.log('📱 שלח את הכתובת הזו למפתח שלך!');
        } catch (e) {}
      });
    }).on('error', () => {});
  } catch (e) {}
});

// טיפול בסגירה
process.on('SIGTERM', () => {
  console.log('\n🔴 SIGTERM received, shutting down proxy');
  proxy.close(() => {
    console.log('✅ Proxy closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🔴 Ctrl+C pressed, shutting down proxy');
  proxy.close(() => {
    console.log('✅ Proxy closed');
    process.exit(0);
  });
});