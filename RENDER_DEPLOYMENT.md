# 🚀 פריסה ל-Render.com - הוראות שלב אחר שלב

## 📋 הקוד כבר ב-GitHub:
**Repository:** https://github.com/nadavsimba24/oref-alerts-api

## 🎯 שלבי הפריסה:

### שלב 1: היכנס ל-Render.com
1. פתח https://render.com
2. לחץ "Sign Up" אם אין לך חשבון, או "Log In"

### שלב 2: צור Web Service חדש
1. לחץ על הכפתור הכחול "New +"
2. בחר "Web Service"

### שלב 3: חבר את ה-GitHub
1. לחץ "Connect a GitHub repository"
2. אשר את הגישה ל-GitHub אם מתבקש
3. חפש את ה-repository: `nadavsimba24/oref-alerts-api`
4. לחץ "Connect"

### שלב 4: הגדר את ה-Web Service
**הגדרות חשובות:**
- **Name:** `oref-alerts-api` (או שם אחר שאתה רוצה)
- **Environment:** `Node`
- **Region:** `Oregon (US West)` או קרוב אליך
- **Branch:** `main`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Free`

### שלב 5: הגדרות נוספות (אופציונלי)
**Environment Variables:**
```
NODE_ENV=production
PORT=3000
CACHE_TTL_CURRENT=30
CACHE_TTL_HISTORY=300
```

**Health Check Path:** `/health`

### שלב 6: פרוס!
1. לחץ "Create Web Service"
2. המתן 2-3 דקות לבנייה ופריסה

## 🌐 אחרי הפריסה:
תקבל כתובת כמו:
```
https://oref-alerts-api.onrender.com
```

**ה-API יהיה זמין ב:**
- `https://oref-alerts-api.onrender.com/health`
- `https://oref-alerts-api.onrender.com/api/alerts/current`
- `https://oref-alerts-api.onrender.com/api/alerts/test`
- `https://oref-alerts-api.onrender.com/api/info`

## ✅ מה כולל ה-API:
1. **התראות נוכחיות** מפיקוד העורף
2. **Caching** מובנה (30 שניות)
3. **Health checks** אוטומטיים
4. **TypeScript** עם קוד בטוח
5. **Error handling** מתקדם
6. **CORS** מופעל

## 🔧 בדיקה אחרי פריסה:
```bash
# בדוק שהכל עובד
curl https://oref-alerts-api.onrender.com/health
curl https://oref-alerts-api.onrender.com/api/alerts/current

# או בדפדפן
# https://oref-alerts-api.onrender.com/api/alerts/test
```

## 📊 לוגים וניטור:
1. ב-Render.com, לחץ על שם ה-service
2. בחר "Logs" כדי לראות את הלוגים
3. בחר "Metrics" כדי לראות סטטיסטיקות

## ⚠️ הערות חשובות:
- **Free plan** - יכול לישון אחרי 15 דקות ללא פעילות
- **HTTPS** - אוטומטי וללא configuration
- **Auto-deploy** - מתעדכן אוטומטית כשדוחפים ל-GitHub
- **Custom domain** - אפשר להוסיף דומיין משלך בהגדרות

## 🆘 תמיכה:
- **בעיות פריסה:** check Render.com logs
- **בעיות קוד:** open issue ב-GitHub
- **שאלות:** contact me

---

**🎉 מוכן לפריסה!** היכנס ל-https://render.com והתחל את התהליך.