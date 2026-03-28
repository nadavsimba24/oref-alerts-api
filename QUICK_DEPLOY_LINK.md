# ⚡ פריסה מהירה ל-Render.com

## 🎯 הקישור הישיר:

### 👉 **לחץ כאן להתחיל פריסה אוטומטית:**
**https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api**

## 📋 מה יקרה כשתפתח את הקישור:

1. **תועבר ל-Render.com** עם ה-repo כבר מוכן
2. **תראה את ההגדרות האוטומטיות** מ-`render.yaml`:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check: `/health`
   - Environment Variables: כבר מוגדרים
3. **לחץ "Create Web Service"**
4. **המתן 2-3 דקות** לבנייה
5. **קבל את הכתובת:** `https://oref-alerts-api.onrender.com`

## 🔧 בדיקה אחרי פריסה:

```bash
# הרץ את סקריפט הבדיקה
./check-deployment.sh

# או בדוק ידנית:
curl https://oref-alerts-api.onrender.com/health
curl https://oref-alerts-api.onrender.com/api/alerts/current
```

## 📁 הקבצים שכבר מוכנים:

- `render.yaml` - הגדרות אוטומטיות ל-Render
- `Dockerfile` - תמיכה ב-Docker
- `package.json` - dependencies והסקריפטים
- `src/` - קוד TypeScript מלא
- `*.md` - תיעוד מלא

## 🚀 יתרונות השימוש ב-`render.yaml`:

1. **אוטומטי** - אין צורך למלא טופס ידני
2. **עקבי** - אותן הגדרות בכל פריסה
3. **מתועד** - ההגדרות נשמרות בקוד
4. **שחזור קל** - פריסה מחדש עם קליק אחד

## ⏱️ זמן משוער: 5 דקות

## 💰 עלות: חינם (Free plan)

## 🌐 תוצאה: API ציבורי עם HTTPS + WebSocket

---

**🎉 מוכן! לחץ על הקישור למעלה והתחל את הפריסה!**

לאחר הפריסה, הרץ `./check-deployment.sh` כדי לוודא שהכל עובד.