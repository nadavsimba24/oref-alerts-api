// שרת HTTPS פשוט עם reverse proxy ל-localhost:3001
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');

const HTTP_PORT = 8888;
const HTTPS_PORT = 8889;
const TARGET_PORT = 3001;

// ניסיון ליצור self-signed certificate (לבדיקה בלבד)
function createSelfSignedCert() {
  const crypto = require('crypto');
  const { execSync } = require('child_process');
  
  try {
    // בדוק אם כבר יש certificates
    if (fs.existsSync('./cert.pem') && fs.existsSync('./key.pem')) {
      return {
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem')
      };
    }
    
    console.log('⚠️  יצירת self-signed certificate לבדיקה...');
    
    // פקודה ליצירת self-signed cert (דורש openssl)
    execSync('openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Oref API/CN=localhost" 2>/dev/null', { stdio: 'ignore' });
    
    return {
      cert: fs.readFileSync('./cert.pem'),
      key: fs.readFileSync('./key.pem')
    };
  } catch (error) {
    console.log('❌ לא ניתן ליצור HTTPS certificate');
    return null;
  }
}

// יצירת reverse proxy
function createProxy(targetPort) {
  return (clientReq, clientRes) => {
    const startTime = Date.now();
    const clientIp = clientReq.socket.remoteAddress;
    
    console.log(`[${new Date().toISOString()}] ${clientReq.method} ${clientReq.url} from ${clientIp}`);
    
    // CORS headers
    clientRes.setHeader('Access-Control-Allow-Origin', '*');
    clientRes.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
    clientRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    clientRes.setHeader('Access-Control-Max-Age', '86400');
    
    if (clientReq.method === 'OPTIONS') {
      clientRes.writeHead(200);
      clientRes.end();
      return;
    }
    
    // פרסור ה-URL
    const targetUrl = url.parse(`http://localhost:${targetPort}${clientReq.url}`);
    
    const options = {
      hostname: 'localhost',
      port: targetPort,
      path: targetUrl.path,
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        host: `localhost:${targetPort}`,
        'x-forwarded-for': clientIp,
        'x-forwarded-proto': clientReq.socket.encrypted ? 'https' : 'http',
        'x-real-ip': clientIp
      }
    };
    
    // יצירת בקשה לשרת המקורי
    const proxyReq = http.request(options, (proxyRes) => {
      // מדידת זמן תגובה
      const responseTime = Date.now() - startTime;
      
      // העתקת headers
      Object.keys(proxyRes.headers).forEach(key => {
        clientRes.setHeader(key, proxyRes.headers[key]);
      });
      
      // הוספת headers נוספים
      clientRes.setHeader('x-proxy-server', 'Oref-API-Gateway');
      clientRes.setHeader('x-original-server', `localhost:${targetPort}`);
      clientRes.setHeader('x-response-time', `${responseTime}ms`);
      clientRes.setHeader('x-request-id', crypto.randomBytes(8).toString('hex'));
      
      clientRes.writeHead(proxyRes.statusCode);
      
      // העברת הנתונים
      proxyRes.pipe(clientRes);
    });
    
    proxyReq.on('error', (err) => {
      console.error(`Proxy error from ${clientIp}: ${err.message}`);
      clientRes.writeHead(502, { 
        'Content-Type': 'application/json',
        'x-error': 'bad_gateway'
      });
      clientRes.end(JSON.stringify({
        error: 'Bad Gateway',
        message: 'השרת המקורי לא זמין',
        timestamp: new Date().toISOString(),
        request_id: crypto.randomBytes(8).toString('hex')
      }));
    });
    
    // העברת body אם יש
    if (['POST', 'PUT', 'PATCH'].includes(clientReq.method)) {
      clientReq.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  };
}

// הרצת השרתים
try {
  const proxyHandler = createProxy(TARGET_PORT);
  
  // שרת HTTP
  const httpServer = http.createServer(proxyHandler);
  
  httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log('='.repeat(70));
    console.log('🌐 ORED ALERTS API - PUBLIC GATEWAY');
    console.log('='.repeat(70));
    console.log(`\n📡 HTTP Server listening on: 0.0.0.0:${HTTP_PORT}`);
    
    // נסה HTTPS אם אפשר
    const sslConfig = createSelfSignedCert();
    if (sslConfig) {
      const httpsServer = https.createServer(sslConfig, proxyHandler);
      
      httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log(`🔒 HTTPS Server listening on: 0.0.0.0:${HTTPS_PORT}`);
        console.log('⚠️  Self-signed certificate - ייתכן אזהרת אבטחה בדפדפן');
      });
    } else {
      console.log('ℹ️  HTTPS לא זמין (דרוש certificate)');
    }
    
    console.log(`\n🎯 Target server: http://localhost:${TARGET_PORT}`);
    
    // הצג כתובות גישה
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    console.log('\n🔗 כתובות גישה אפשריות:');
    console.log(`  • http://localhost:${HTTP_PORT}`);
    
    Object.keys(interfaces).forEach((ifname) => {
      interfaces[ifname].forEach((iface) => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }
        console.log(`  • http://${iface.address}:${HTTP_PORT}`);
        if (sslConfig) {
          console.log(`  • https://${iface.address}:${HTTPS_PORT} (self-signed)`);
        }
      });
    });
    
    // נסה לקבל IP ציבורי
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          console.log(`\n🌍 כתובת IP ציבורית: http://${ip}:${HTTP_PORT}`);
          if (sslConfig) {
            console.log(`   או: https://${ip}:${HTTPS_PORT} (self-signed)`);
          }
          console.log('\n📋 שלח למפתח שלך:');
          console.log(`API Endpoint: http://${ip}:${HTTP_PORT}/api/alerts/current`);
          console.log(`Health check: http://${ip}:${HTTP_PORT}/health`);
        } catch (e) {}
      });
    }).on('error', () => {
      console.log('\n⚠️  לא ניתן לקבל IP ציבורי. ייתכן שאין חיבור אינטרנט.');
    });
    
    console.log('\n⚡ Endpoints:');
    console.log(`  • /health`);
    console.log(`  • /api/alerts/current`);
    console.log(`  • /api/alerts/test`);
    console.log(`  • /api/info`);
    
    console.log('\n🔧 פתרון בעיות:');
    console.log('1. אם פורט 80 חסום, נסה: sudo ufw allow 80/tcp');
    console.log('2. לכתובת HTTPS קבועה, השתמש ב-Cloudflare Tunnel');
    console.log('3. לפריסה עננית, השתמש ב-Render.com (חינם)');
    console.log('='.repeat(70));
  });
  
  httpServer.on('error', (err) => {
    if (err.code === 'EACCES') {
      console.log(`❌ אין הרשאות לפתוח פורט ${HTTP_PORT}. נסה פורט גבוה יותר:`);
      console.log('   node https-server.js --port 8080');
    } else if (err.code === 'EADDRINUSE') {
      console.log(`❌ פורט ${HTTP_PORT} תפוס. נסה פורט אחר:`);
      console.log('   node https-server.js --port 8080');
    } else {
      console.log(`❌ שגיאת שרת: ${err.message}`);
    }
    process.exit(1);
  });
  
  // טיפול בסגירה
  process.on('SIGTERM', () => {
    console.log('\n🔴 SIGTERM received, shutting down');
    httpServer.close(() => {
      console.log('✅ HTTP Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('\n🔴 Ctrl+C pressed, shutting down');
    httpServer.close(() => {
      console.log('✅ HTTP Server closed');
      process.exit(0);
    });
  });
  
} catch (error) {
  console.error(`❌ שגיאה בהרצת השרת: ${error.message}`);
  process.exit(1);
}