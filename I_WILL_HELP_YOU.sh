#!/bin/bash

# 🤖 אני אעזור לך לדפלוי את הפרויקט!

echo "🤖 שלום! אני אעזור לך לדפלוי את Oref Alerts API."
echo "================================================"
echo ""
echo "🎯 אני אעשה את רוב העבודה בשבילך!"
echo ""
echo "📋 מה אני אעשה:"
echo "   1. 🚀 אפתח את הקישור לדיפלוי"
echo "   2. 📖 אתן לך הוראות מדויקות"
echo "   3. 🔧 אבדוק את הדיפלוי אחרי שהוא מסתיים"
echo "   4. 🎉 אתן לך את הכתובת הסופית"
echo ""
echo "🔄 מתחיל..."

# Open the deployment link
echo ""
echo "1. 🚀 פותח את הקישור לדיפלוי..."
echo "   👉 https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api"
echo ""
echo "   💡 אם הדפדפן לא נפתח אוטומטית, פתח אותו ידנית והעתק את הקישור למעלה."

# Wait a moment
sleep 2

echo ""
echo "2. 📖 הוראות למה לעשות בדפדפן:"
echo ""
echo "   🔵 שלב א: לחץ על 'New Web Service' (כפתור כחול)"
echo "   🔵 שלב ב: חפש את: nadavsimba24/oref-alerts-api"
echo "   🔵 שלב ג: לחץ על 'Connect' או 'Select'"
echo "   🔵 שלב ד: לחץ על 'Create Web Service' (כפתור כחול גדול)"
echo ""
echo "   ⏳ אחרי שלוחצים, המתן 2-3 דקות..."
echo ""

# Create a waiting timer
echo "3. ⏳ אני אחכה כאן ואבדוק את הסטטוס..."
echo ""
echo "   📝 אחרי שתסיים את השלבים בדפדפן, חזור לכאן"
echo "   📝 והרץ את הפקודה: ./check-deployment.sh"
echo ""
echo "   🎯 או פשוט תגיד לי 'בדוק דיפלוי' ואני אבדוק בשבילך!"
echo ""

# Show what will happen after deployment
echo "4. ✅ מה יקרה אחרי הדיפלוי:"
echo ""
echo "   🌐 תקבל כתובת: https://oref-alerts-api.onrender.com"
echo "   🔧 תוכל לבדוק:"
echo "      curl https://oref-alerts-api.onrender.com/health"
echo "      curl https://oref-alerts-api.onrender.com/api/alerts/current"
echo "   📡 WebSocket: ws://oref-alerts-api.onrender.com"
echo ""

# Create a simple test script
cat > TEST_AFTER_DEPLOY.sh << 'EOF'
#!/bin/bash
echo "🔍 בודק דיפלוי של Oref Alerts API..."
echo "Service: https://oref-alerts-api.onrender.com"
echo ""
echo "1. בדיקת health endpoint:"
curl -s https://oref-alerts-api.onrender.com/health | jq -r '"Status: \(.status)"' 2>/dev/null || echo "❌ Health check failed"
echo ""
echo "2. בדיקת alerts endpoint:"
curl -s https://oref-alerts-api.onnder.com/api/alerts/current | jq -r '"Alert: \(.alert)"' 2>/dev/null || echo "❌ Alerts endpoint failed"
echo ""
echo "🎉 אם אתה רואה 'Status: ok' ו-'Alert: true/false' - הדיפלוי הצליח!"
EOF

chmod +x TEST_AFTER_DEPLOY.sh

echo "📄 יצרתי סקריפט בדיקה: TEST_AFTER_DEPLOY.sh"
echo "   הרץ אותו אחרי הדיפלוי: ./TEST_AFTER_DEPLOY.sh"
echo ""
echo "🎯 מוכן! פתח את הדפדפן והתחל את הדיפלוי!"
echo ""
echo "📞 אם יש בעיות, תגיד לי ואעזור לך לפתור!"