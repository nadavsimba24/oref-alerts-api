# מדריך פריסה - Oref Alerts API 🌐

## 📖 תוכן עניינים
1. [אפשרויות פריסה](#אפשרויות-פריסה)
2. [פריסה מקומית עם גישה מרחוק](#פריסה-מקומית-עם-גישה-מרחוק)
3. [פריסה ב-VPS/שרת ענן](#פריסה-ב-vpsשרת-ענן)
4. [פריסה ב-Render/Heroku/Vercel](#פריסה-ב-renderherokuvercel)
5. [הגדרת דומיין מותאם](#הגדרת-דומיין-מותאם)
6. [אבטחה והגנה](#אבטחה-והגנה)
7. [Monitoring וניהול](#monitoring-וניהול)

## 🎯 אפשרויות פריסה

### **אפשרות 1: מקומי עם גישה מרחוק** (הכי קל)
- ✅ מתאים לבדיקות ופיתוח
- ✅ אין עלויות
- ❌ תלוי במחשב שלך

### **אפשרות 2: VPS/שרת ענן** (מומלץ)
- ✅ זמין 24/7
- ✅ ביצועים טובים
- ✅ שליטה מלאה
- 💰 עלות חודשית

### **אפשרות 3: Platform as a Service** (קל לניהול)
- ✅ ניהול אוטומטי
- ✅ scaling אוטומטי
- ✅ פחות שליטה
- 💰 עלות לפי שימוש

## 🏠 פריסה מקומית עם גישה מרחוק

### שלב 1: התקנת ngrok
```bash
# macOS עם Homebrew
brew install ngrok/ngrok/ngrok

# או הורדה ישירה
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# או עם npm
npm install -g ngrok
```

### שלב 2: הרשמה ל-ngrok
1. היכנס ל-https://ngrok.com
2. צור חשבון חינם
3. קבל את ה-auth token שלך
4. הגדר את ה-token:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### שלב 3: הרצת השרת + ngrok
```bash
# בחלון 1 - הרץ את השרת
cd /Users/anna/.openclaw/workspace/oref-api
npm run dev

# בחלון 2 - הרץ את ngrok
ngrok http 3000
```

### שלב 4: קבל את הכתובת הציבורית
ngrok יציג משהו כמו:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**הכתובת הציבורית שלך:** `https://abc123.ngrok.io`

### שלב 5: בדוק את החיבור
```bash
# בדוק מהמחשב שלך
curl https://abc123.ngrok.io/health

# או מהטלפון
# פתח דפדפן וכתוב: https://abc123.ngrok.io/health
```

## 🖥️ פריסה ב-VPS/שרת ענן

### אפשרות A: DigitalOcean Droplet ($5/חודש)
```bash
# התחבר לשרת
ssh root@your-server-ip

# עדכן את המערכת
apt update && apt upgrade -y

# התקן Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# התקן Git
apt install -y git

# הורד את הקוד
git clone https://github.com/yourusername/oref-api.git
cd oref-api

# התקן תלויות
npm install

# בנה את הפרויקט
npm run build

# הרץ עם PM2 (ניהול תהליכים)
npm install -g pm2
pm2 start dist/index.js --name oref-api

# הגדר הפעלה אוטומטית
pm2 startup
pm2 save

# פתח את הפורט בפיירוול
ufw allow 3000/tcp
ufw enable
```

### אפשרות B: AWS EC2
```bash
# התחבר ל-EC2
ssh -i your-key.pem ubuntu@ec2-ip

# התקן Docker
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# הורד והרץ את התמונה
sudo docker pull yourusername/oref-api
sudo docker run -d -p 3000:3000 --name oref-api yourusername/oref-api

# בדוק שהכל עובד
curl http://localhost:3000/health
```

### אפשרות C: Google Cloud Run (שרתless)
```bash
# בנה את התמונה
gcloud builds submit --tag gcr.io/your-project/oref-api

# פרוס ל-Cloud Run
gcloud run deploy oref-api \
  --image gcr.io/your-project/oref-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

## ☁️ פריסה ב-Render/Heroku/Vercel

### Render.com (מומלץ, חינם)
1. היכנס ל-https://render.com
2. לחץ על "New +" → "Web Service"
3. חבר את ה-GitHub repository שלך
4. הגדר:
   - **Name:** oref-api
   - **Environment:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. לחץ "Create Web Service"

### Heroku
```bash
# התקן את Heroku CLI
brew tap heroku/brew && brew install heroku

# התחבר
heroku login

# צור אפליקציה
heroku create oref-api-yourname

# פרוס
git push heroku main

# פתח
heroku open
```

### Vercel
```bash
# התקן את Vercel CLI
npm i -g vercel

# פרוס
vercel

# או דרך האתר
# 1. היכנס ל-https://vercel.com
# 2. לחץ "Import Project"
# 3. בחר את ה-Git repository
# 4. הגדר:
#    - Build Command: npm run build
#    - Output Directory: dist
#    - Install Command: npm install
```

## 🌐 הגדרת דומיין מותאם

### עם ngrok (חינם)
```bash
# שדרג ל-ngrok Pro ($8/חודש)
ngrok http 3000 --domain your-domain.ngrok.app
```

### עם Cloudflare Tunnel (חינם)
```bash
# התקן את cloudflared
brew install cloudflared

# התחבר ל-Cloudflare
cloudflared tunnel login

# צור tunnel
cloudflared tunnel create oref-tunnel

# הגדר את ה-tunnel
echo 'tunnel: YOUR_TUNNEL_ID
credentials-file: /Users/anna/.cloudflared/YOUR_TUNNEL_ID.json
ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404' > ~/.cloudflared/config.yml

# הרץ את ה-tunnel
cloudflared tunnel run oref-tunnel

# הגדר DNS ב-Cloudflare
# הוסף רשומה CNAME: api -> YOUR_TUNNEL_ID.cfargotunnel.com
```

### עם VPS + Nginx
```nginx
# /etc/nginx/sites-available/oref-api
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 אבטחה והגנה

### 1. Rate Limiting
הוסף ל-`src/index.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100, // 100 בקשות לכל IP
  message: { error: 'יותר מדי בקשות, נסה שוב מאוחר יותר' }
});

app.use('/api/', limiter);
```

### 2. CORS הגבלה
```typescript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### 3. Environment Variables
צור קובץ `.env`:
```env
# אבטחה
API_KEY=your-secret-key-here
JWT_SECRET=super-secret-jwt-key

# הגבלות
MAX_REQUESTS_PER_MINUTE=60
WS_MAX_CONNECTIONS=50

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=warn
```

### 4. Basic Authentication
```typescript
import basicAuth from 'express-basic-auth';

app.use(basicAuth({
  users: { 'admin': 'secure-password' },
  challenge: true,
  realm: 'Oref API'
}));
```

## 📊 Monitoring וניהול

### עם PM2
```bash
# התקן PM2
npm install -g pm2

# הרץ את השרת
pm2 start dist/index.js --name oref-api

# צפה בלוגים
pm2 logs oref-api

# צפה בסטטוס
pm2 status

# הפעל מחדש
pm2 restart oref-api

# עצור
pm2 stop oref-api

# מחק
pm2 delete oref-api
```

### עם Docker Compose
```yaml
version: '3.8'
services:
  oref-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  # Monitoring עם Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  # Dashboard עם Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Health Checks
```bash
# בדיקת בריאות
curl https://api.yourdomain.com/health

# בדיקת מטריקות
curl https://api.yourdomain.com/metrics

# בדיקת WebSocket
wscat -c wss://api.yourdomain.com
```

## 🚀 פריסה מהירה - המלצה אישית

### **למתחילים:** Render.com
1. דחוף את הקוד ל-GitHub
2. היכנס ל-Render.com
3. לחץ "New Web Service"
4. בחר את ה-repository
5. לחץ "Deploy"

### **למתקדמים:** DigitalOcean + Docker
```bash
# בנה תמונה
docker build -t yourusername/oref-api .

# העלה ל-Docker Hub
docker push yourusername/oref-api

# ב-DigitalOcean
docker run -d -p 3000:3000 --name oref-api yourusername/oref-api
```

### **לפיתוח:** מקומי + ngrok
```bash
# הרץ את השרת
npm run dev

# בחלון נפרד
ngrok http 3000

# שתף את ה-ngrok URL
```

## 📞 תמיכה בפריסה

### בעיות נפוצות:
1. **פורט תפוס:** שנה פורט ב-`.env`
2. **חומת אש:** פתח פורט 3000
3. **זיכרון:** הגדר `NODE_OPTIONS=--max-old-space-size=512`
4. **WebSocket לא עובד:** בדוק proxy settings

### דיווח על בעיות:
1. בדוק את הלוגים: `pm2 logs` או `docker logs`
2. בדוק חיבור: `curl http://localhost:3000/health`
3. בדוק פורטים: `netstat -tuln | grep 3000`
4. פתח issue ב-GitHub עם הלוגים

---

**חשוב:** לפני פריסה לפרודקשן:
1. שנה את כל הסיסמאות
2. הגדר HTTPS
3. הפעל rate limiting
4. הגדר backup
5. בדוק את הביצועים