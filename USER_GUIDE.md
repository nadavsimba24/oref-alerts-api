# מדריך משתמש - Oref Alerts API 🚨

## 📖 תוכן עניינים
1. [הקדמה](#הקדמה)
2. [התקנה מהירה](#התקנה-מהירה)
3. [שימוש בסיסי](#שימוש-בסיסי)
4. [API Endpoints](#api-endpoints)
5. [WebSocket - התראות בזמן אמת](#websocket---התראות-בזמן-אמת)
6. [דוגמאות קוד](#דוגמאות-קוד)
7. [פתרון בעיות](#פתרון-בעיות)
8. [שאלות נפוצות](#שאלות-נפוצות)

## 🎯 הקדמה

**Oref Alerts API** הוא שירות שמספק גישה להתראות פיקוד העורף בזמן אמת. השירות כולל:

- **התראות נוכחיות** - אילו ערים נמצאות תחת התרעה
- **היסטוריה** - התראות מ-24 השעות האחרונות
- **WebSocket** - עדכונים בזמן אמת
- **Caching** - ביצועים טובים יותר

## 🚀 התקנה מהירה

### אפשרות 1: עם Docker (הכי קל)
```bash
# הורד את התמונה
docker pull yourusername/oref-api

# הרץ את הקונטיינר
docker run -p 8080:8080 --name oref-api yourusername/oref-api

# או עם Docker Compose
docker-compose up -d
```

### אפשרות 2: התקנה ידנית
```bash
# הורד את הקוד
git clone https://github.com/yourusername/oref-api.git
cd oref-api

# התקן תלויות
npm install

# הרץ בפיתוח
npm run dev

# או בנה והרץ
npm run build
npm start
```

## 📡 שימוש בסיסי

### בדיקת חיבור
```bash
curl http://localhost:8080/health
```

**תשובה:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### קבלת התראות נוכחיות
```bash
curl http://localhost:8080/api/alerts/current
```

## 🌐 API Endpoints

### 1. `GET /health`
**מטרה:** בדיקת חיבור לשרת

**תשובה:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. `GET /api/alerts/current`
**מטרה:** קבלת התראות נוכחיות

**תשובה:**
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

**פרמטרים:**
- `alert`: `true` אם יש התראות, `false` אם אין
- `current.data`: רשימת ערים עם התראות
- `current.id`: מזהה ייחודי
- `current.title`: כותרת ההתראה

### 3. `GET /api/alerts/history`
**מטרה:** היסטוריית התראות (24 שעות אחרונות)

**תשובה:**
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

### 4. `GET /api/alerts/cities`
**מטרה:** רשימת ערים עם התראות נוכחיות

**תשובה:**
```json
["תל אביב - מרכז", "ירושלים"]
```

### 5. `GET /api/alerts/regions`
**מטרה:** התראות מקובצות לפי אזורים

**תשובה:**
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

## ⚡ WebSocket - התראות בזמן אמת

### חיבור ל-WebSocket
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

### סוגי הודעות:

#### 1. הודעה ראשונית (`initial`)
נשלחת מיד לאחר החיבור:
```json
{
  "type": "initial",
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

#### 2. עדכון (`update`)
נשלחת כל 5 שניות:
```json
{
  "type": "update",
  "data": {
    "alert": true,
    "current": {
      "data": ["תל אביב", "ירושלים"],
      "id": 1704067205000,
      "title": "התרעות פיקוד העורף"
    }
  }
}
```

### דוגמת קוד מלאה:
```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('מחובר ל-WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'initial':
      console.log('מצב התחלתי:', message.data);
      break;
    case 'update':
      if (message.data.alert) {
        console.log('🚨 התראה חדשה:', message.data.current.data);
        // שלח התראה למשתמש
        sendNotification(message.data.current.data);
      }
      break;
  }
};

ws.onerror = (error) => {
  console.error('שגיאת WebSocket:', error);
};

ws.onclose = () => {
  console.log('החיבור נסגר');
};
```

## 💻 דוגמאות קוד

### JavaScript/Node.js
```javascript
const axios = require('axios');

class OrefClient {
  constructor(baseURL = 'http://localhost:8080') {
    this.baseURL = baseURL;
  }

  async getCurrentAlerts() {
    const response = await axios.get(`${this.baseURL}/api/alerts/current`);
    return response.data;
  }

  async getAlertHistory() {
    const response = await axios.get(`${this.baseURL}/api/alerts/history`);
    return response.data;
  }

  async checkCity(cityName) {
    const alerts = await this.getCurrentAlerts();
    return alerts.current.data.some(city => city.includes(cityName));
  }
}

// שימוש
const client = new OrefClient();
const alerts = await client.getCurrentAlerts();

if (alerts.alert) {
  console.log('🚨 יש התראות בערים:', alerts.current.data);
}
```

### Python
```python
import requests
import json

class OrefClient:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
    
    def get_current_alerts(self):
        response = requests.get(f"{self.base_url}/api/alerts/current")
        return response.json()
    
    def get_alert_history(self):
        response = requests.get(f"{self.base_url}/api/alerts/history")
        return response.json()

# שימוש
client = OrefClient()
alerts = client.get_current_alerts()

if alerts['alert']:
    print(f"🚨 יש התראות בערים: {', '.join(alerts['current']['data'])}")
```

### Bash Script
```bash
#!/bin/bash

# קבלת התראות
ALERTS=$(curl -s http://localhost:8080/api/alerts/current)

# בדיקה אם יש התראות
if echo "$ALERTS" | grep -q '"alert":true'; then
    CITIES=$(echo "$ALERTS" | grep -o '"data":\[[^]]*\]' | sed 's/"data":\[//' | sed 's/\]//' | sed 's/"//g')
    echo "🚨 התראות בערים: $CITIES"
    
    # שליחת התראה (דוגמה עם osascript ב-macOS)
    osascript -e "display notification \"התראות בערים: $CITIES\" with title \"פיקוד העורף\""
else
    echo "✅ אין התראות כרגע"
fi
```

## 🛠️ פתרון בעיות

### בעיה: השרת לא נפתח
**פתרון:**
```bash
# בדוק אם הפורט תפוס
lsof -i :8080

# או שנה פורט בקובץ .env
PORT=8081
```

### בעיה: אין תשובה מה-API
**פתרון:**
1. בדוק שהשרת רץ: `curl http://localhost:8080/health`
2. בדוק את הלוגים: `docker logs oref-api`
3. בדוק חיבור לאינטרנט

### בעיה: WebSocket לא מתחבר
**פתרון:**
1. בדוק שהשרת תומך ב-WebSocket
2. בדוק חומת אש
3. נסה חיבור עם `wscat`:
```bash
npm install -g wscat
wscat -c ws://localhost:8080
```

## ❓ שאלות נפוצות

### Q: כמה זמן נשמרת היסטוריה?
**A:** 24 שעות אחרונות בלבד (כמו באתר פיקוד העורף).

### Q: כמה פעמים אפשר לשאול את ה-API?
**A:** מומלץ לא יותר מפעם ב-30 שניות. יש caching מובנה.

### Q: האם צריך API key?
**A:** לא, השירות חינמי ופתוח.

### Q: האם זה רשמי מפיקוד העורף?
**A:** לא, זה שירות עצמאי שמתבסס על המידע הציבורי.

### Q: האם יש הגבלת שימוש?
**A:** מומלץ להשתמש באחריות ולא להעמיס על השרתים.

## 🔧 הגדרות מתקדמות

### Environment Variables
צור קובץ `.env`:
```env
PORT=8080
NODE_ENV=production
CACHE_TTL_CURRENT=30
CACHE_TTL_HISTORY=300
LOG_LEVEL=info
```

### Docker עם הגדרות מותאמות
```bash
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e CACHE_TTL_CURRENT=30 \
  --name oref-api \
  yourusername/oref-api
```

### Monitoring
```bash
# בדיקת בריאות
curl http://localhost:8080/health

# בדיקת לוגים
docker logs oref-api

# סטטיסטיקות
docker stats oref-api
```

## 📞 תמיכה

### דיווח על באגים
1. פתח issue ב-GitHub
2. תאר את הבעיה בפירוט
3. צרף לוגים רלוונטיים

### בקשות פיצ'רים
1. בדוק אם כבר קיים
2. תאר את הצורך
3. הצע מימוש אפשרי

### קהילה
- [GitHub Discussions](https://github.com/yourusername/oref-api/discussions)
- [Discord Server](https://discord.gg/your-server)

## 📄 רישיון

MIT License - ראו קובץ [LICENSE](LICENSE) לפרטים.

---

**חשוב:** שימוש באחריות. השירות לא מחליף את האזעקות הרשמיות של פיקוד העורף.