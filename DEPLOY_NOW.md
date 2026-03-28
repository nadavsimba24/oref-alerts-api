# 🚀 פריסה מיידית ל-Render.com

## 📋 שלבים לפריסה (5 דקות):

### שלב 1: דחוף את הקוד ל-GitHub
```bash
# אם עדיין לא יצרת repository
git init
git add .
git commit -m "Initial commit: Oref Alerts API"
git branch -M main

# צור repository חדש ב-GitHub
# ואז:
git remote add origin https://github.com/YOUR_USERNAME/oref-api.git
git push -u origin main
```

### שלב 2: פרוס ל-Render.com
1. היכנס ל-https://render.com
2. לחץ על "New +" → "Web Service"
3. בחר "Connect a GitHub repository"
4. בחר את ה-repository `oref-api`
5. הגדר:
   - **Name:** `oref-alerts-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
6. לחץ "Create Web Service"

### שלב 3: קבל את הכתובת הציבורית
אחרי הפריסה (2-3 דקות), תקבל כתובת כמו:
```
https://oref-alerts-api.onrender.com
```

## 🌐 הכתובת הסופית תהיה:
```
https://oref-alerts-api.onrender.com/api/alerts/current
```

## ✅ יתרונות:
- **HTTPS** אוטומטי (ללא configuration)
- **24/7** (עם Free plan - יכול לישון אחרי 15 דקות ללא פעילות)
- **אוטומטי** - מתעדכן אוטומטית כשדוחפים ל-GitHub
- **לוגים** מובנים
- **Health checks** אוטומטיים

## 📁 מה כבר מוכן:
1. ✅ `package.json` עם dependencies
2. ✅ `tsconfig.json` להדר TypeScript
3. ✅ `render.yaml` להגדרות פריסה
4. ✅ קוד מלא ב-TypeScript
5. ✅ Caching מובנה
6. ✅ Error handling
7. ✅ Health checks

## 🔧 אם רוצים לבדוק מקומית לפני פריסה:
```bash
# התקן תלויות
npm install

# הרץ בפיתוח
npm run dev

# או בנה והרץ
npm run build
npm start
```

## 📞 תמיכה:
- בעיות פריסה: check Render.com logs
- בעיות קוד: open GitHub issue
- שאלות: contact me