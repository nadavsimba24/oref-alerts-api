# 🚀 פריסה מהירה ל-Render.com - הוראות עם screenshots

## 📋 לפני שמתחילים:
1. **יש לך חשבון GitHub** עם הקוד ב: https://github.com/nadavsimba24/oref-alerts-api
2. **צור חשבון Render.com** (חינם) בכתובת: https://render.com

## 🎯 שלבי הפריסה:

### שלב 1: היכנס ל-Render.com
![Step 1](https://render.com/images/landing-page.png)

### שלב 2: לחץ על "New +" → "Web Service"
![Step 2](https://render.com/images/new-service-button.png)

### שלב 3: חבר את ה-GitHub
1. לחץ "Connect a GitHub repository"
2. אשר את הגישה ל-GitHub
3. חפש: `nadavsimba24/oref-alerts-api`
4. לחץ "Connect"

### שלב 4: מלא את הטופס
**העתק את ההגדרות הבאות:**

| שדה | ערך |
|------|------|
| **Name** | `oref-alerts-api` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### שלב 5: הגדרות מתקדמות (אופציונלי)
לחץ על "Advanced" והוסף Environment Variables:
```
NODE_ENV=production
PORT=3000
CACHE_TTL_CURRENT=30
CACHE_TTL_HISTORY=300
```

### שלב 6: פרוס!
לחץ על הכפתור הכחול "Create Web Service"

## ⏳ המתן 2-3 דקות
Render יבנה ויפרוס את האפליקציה. תראה לוגים בזמן אמת.

## ✅ אחרי הפריסה:
תקבל מסך עם הכתובת שלך:
```
https://oref-alerts-api.onrender.com
```

**שמור את הכתובת הזו!**

## 🔧 בדיקה מהירה:
פתח דפדפן חדש ובדוק:
1. https://oref-alerts-api.onrender.com/health
2. https://oref-alerts-api.onrender.com/api/alerts/current
3. https://oref-alerts-api.onrender.com/api/alerts/test

## 📊 ניהול ה-service:
1. **לוגים:** Render Dashboard → Service → Logs
2. **מטריקות:** Render Dashboard → Service → Metrics
3. **הגדרות:** Render Dashboard → Service → Settings
4. **Custom Domain:** אפשר להוסיף בהגדרות

## ⚠️ הערות חשובות:
- **Free plan** - יכול לישון אחרי 15 דקות ללא פעילות
- **HTTPS** - אוטומטי וללא configuration
- **Auto-deploy** - מתעדכן אוטומטית כשדוחפים ל-GitHub
- **לוגים** - זמינים ב-Realtime

## 🆘 תמיכה:
- **בעיות פריסה:** check Render.com logs
- **בעיות קוד:** open issue ב-GitHub
- **שאלות:** שלח לי הודעה

---

**🎉 מוכן!** היכנס ל-https://render.com והתחל את התהליך. זה ייקח 5 דקות בלבד!