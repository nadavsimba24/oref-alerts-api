# 🖱️ לחץ כאן כדי לדפלוי - הוראות עם תמונות

## 🎯 **שלב 1: פתח את הקישור**
**👉 לחץ כאן:**  
**https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api**

![Step 1](https://via.placeholder.com/800x400/0070f3/ffffff?text=1.+Open+https://dashboard.render.com/new/web)

## 🎯 **שלב 2: לחץ על "New Web Service"**
כשתפתח את הקישור, תראה את המסך הזה:

```
[Render Dashboard]
├── [Sidebar]
│   └── Projects
└── [Main Area]
    └── [Button] New Web Service  ← **לחץ כאן!**
```

**לחץ על הכפתור הכחול "New Web Service"**

## 🎯 **שלב 3: בחר את ה-GitHub repository**
תראה רשימה של repositories. **חפש את:**  
`nadavsimba24/oref-alerts-api`

**לחץ עליו** כדי לבחור.

## 🎯 **שלב 4: ראה את ההגדרות האוטומטיות**
Render יזהה את `render.yaml` וימלא אוטומטית:

```
✅ Name: oref-alerts-api
✅ Environment: Node
✅ Build Command: npm install && npm run build
✅ Start Command: npm start
✅ Health Check Path: /health
✅ Environment Variables: כבר מוגדרים
```

## 🎯 **שלב 5: לחץ "Create Web Service"**
**לחץ על הכפתור הכחול הגדול** בתחתית הדף.

## ⏳ **שלב 6: המתן לדיפלוי**
תראה לוגים בזמן אמת:
```
✓ Cloning repository...
✓ Installing dependencies...
✓ Building TypeScript...
✓ Starting server...
✓ Health check passed!
```

**זמן משוער:** 2-3 דקות

## ✅ **שלב 7: קבל את הכתובת**
אחרי הדיפלוי תקבל:
**🌐 https://oref-alerts-api.onrender.com**

## 🔧 **שלב 8: בדוק את הדיפלוי**
**הרץ את הפקודה הזו בטרמינל:**
```bash
cd oref-api
./check-deployment.sh
```

**או בדוק ידנית:**
```bash
# בדוק אם השרת עובד
curl https://oref-alerts-api.onrender.com/health

# בדוק התרעות נוכחיות
curl https://oref-alerts-api.onrender.com/api/alerts/current
```

## 🆘 **אם נתקעת:**

### בעיה 1: לא רואה את ה-repository
**פתרון:** ודא שאתה מחובר ל-GitHub ב-Render.

### בעיה 2: שגיאת בנייה
**פתרון:** בדוק את הלוגים ב-Render dashboard.

### בעיה 3: השרת לא עולה
**פתרון:** הרץ `./check-deployment.sh` ובדוק את השגיאות.

## 📞 **תמיכה:**
- **שאלות:** שלח לי הודעה
- **בעיות:** פתח issue ב-GitHub
- **לוגים:** https://dashboard.render.com → Logs

## 🎉 **סיכום:**
**זמן:** 5 דקות  
**עלות:** חינם  
**תוצאה:** API ציבורי עם HTTPS + WebSocket  

**מוכן! לחץ על הקישור למעלה והתחל 🚀**