# 🚀 Oref Alerts API - Setup & Deployment Guide

## 📋 סטטוס נוכחי
**✅ הכל מוכן לדיפלוי!**

### מה כבר עשינו:
1. ✅ קוד מלא ב-TypeScript
2. ✅ WebSocket support
3. ✅ Caching system
4. ✅ Error handling
5. ✅ Health checks
6. ✅ Docker support
7. ✅ Render.com configuration
8. ✅ GitHub repository ready
9. ✅ כל הקבצים נדחפו ל-GitHub

## 🎯 שלבי דיפלוי סופיים

### שלב 1: ודא שהכל עובד מקומית
```bash
# הרץ את סקריפט הבדיקה
./deploy.sh

# או באופן ידני:
npm install
npm run build
npm start
```

### שלב 2: דפלוי ל-Render.com
**זמן משוער: 5 דקות**

1. **פתח את Render.com** - https://dashboard.render.com
2. **לחץ "New +" → "Web Service"**
3. **חבר את ה-GitHub repository** - `nadavsimba24/oref-alerts-api`
4. **השתמש בהגדרות האוטומטיות** (render.yaml כבר מוגדר)
5. **לחץ "Create Web Service"**

### שלב 3: המתן לדיפלוי
- Render יבנה את הפרויקט אוטומטית
- ייקח 2-3 דקות
- תראה לוגים בזמן אמת

### שלב 4: קבל את הכתובת
אחרי הדיפלוי, תקבל כתובת כמו:
```
https://oref-alerts-api.onrender.com
```

## 🌐 בדיקת ה-API
פתח דפדפן ובדוק:

### Health check
```
https://oref-alerts-api.onrender.com/health
```
**תשובה צפויה:**
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Current alerts
```
https://oref-alerts-api.onrender.com/api/alerts/current
```
**תשובה צפויה:**
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

### WebSocket connection
```
ws://oref-alerts-api.onrender.com
```
**חיבור אוטומטי לעדכונים בזמן אמת**

## 📁 מבנה הפרויקט
```
oref-api/
├── src/                    # קוד מקור TypeScript
│   ├── index.ts           # נקודת כניסה ראשית
│   ├── services/          # שירותים (Oref, Cache)
│   └── utils/             # utilities (Logger)
├── dist/                  # קוד מהודר (נוצר אוטומטית)
├── package.json          # dependencies והגדרות
├── tsconfig.json         # TypeScript configuration
├── render.yaml           # Render.com deployment config
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose
└── *.md                 # מסמכי הדרכה
```

## 🔧 קבצי הדרכה זמינים
| קובץ | תיאור |
|------|-------|
| `OPEN_RENDER.md` | הוראות מפורטות עם screenshots |
| `QUICK_DEPLOY.md` | הוראות מהירות |
| `DEPLOY_NOW.md` | פריסה מיידית |
| `RENDER_DEPLOYMENT.md` | הדרכה מפורטת ל-Render |
| `USER_GUIDE.md` | מדריך למשתמש |
| `DEPLOYMENT_GUIDE.md` | מדריך פריסה מלא |

## ⚙️ Environment Variables
הגדרות אוטומטיות ב-`render.yaml`:
```yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: 3000
  - key: CACHE_TTL_CURRENT
    value: 30
  - key: CACHE_TTL_HISTORY
    value: 300
```

## 📊 תכונות מתקדמות
1. **Caching** - מפחית קריאות API חוזרות
2. **Rate limiting** - מגן מפני התקפות
3. **WebSocket** - עדכונים בזמן אמת
4. **Health checks** - ניטור אוטומטי
5. **Logging** - לוגים מפורטים
6. **Error handling** - טיפול בשגיאות

## 🐳 Docker deployment
```bash
# Build and run locally
docker build -t oref-api .
docker run -p 3000:3000 oref-api

# Or with Docker Compose
docker-compose up
```

## 🆘 פתרון בעיות

### השרת לא עולה
1. בדוק את הלוגים ב-Render Dashboard → Logs
2. ודא ש-`npm run build` עובד מקומית
3. בדוק Environment Variables

### API לא מגיב
1. בדוק `/health` endpoint
2. ודא שה-Oref API זמין
3. בדוק caching settings

### WebSocket לא עובד
1. ודא חיבור ל-`ws://` ולא `http://`
2. בדוק אם השרת תומך ב-WebSocket
3. בדוק לוגי חיבור

## 📞 תמיכה
- **GitHub Issues**: https://github.com/nadavsimba24/oref-alerts-api/issues
- **Render Support**: Render Dashboard → Support
- **Documentation**: קרא את הקבצי `*.md`

## 🎉 סיכום
**הפרויקט מוכן לדיפלוי מלא!**

**זמן משוער:** 5 דקות  
**עלות:** חינם (Free plan)  
**תכונות:** HTTPS, WebSocket, Caching, Auto-deploy

**השלב הבא:** היכנס ל-https://dashboard.render.com/new/web והתחל את הדיפלוי!