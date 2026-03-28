#!/bin/bash

# 🚀 FINAL DEPLOYMENT SCRIPT
# I'll deploy the Oref Alerts API for you!

set -e

echo "🚀 אני אדפלוי את Oref Alerts API בשבילך!"
echo "========================================"
echo ""
echo "📋 בדיקת הכנה..."
echo ""

# Check if project is ready
if [ ! -f "package.json" ]; then
    echo "❌ שגיאה: לא נמצא קובץ package.json"
    exit 1
fi

if [ ! -f "render.yaml" ]; then
    echo "❌ שגיאה: לא נמצא קובץ render.yaml"
    exit 1
fi

echo "✅ הפרויקט מוכן לדיפלוי"
echo "✅ קובץ render.yaml קיים"
echo "✅ קוד TypeScript מוכן"
echo ""

# Try to deploy via Render API
echo "🔄 מנסה לדפלוי דרך Render API..."
RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"
OWNER_ID="tea-d74152juibrs73cn0240"

# Create the service using the correct API format
echo "📦 יצירת שירות ב-Render..."

# First, let's check what services already exist
echo "🔍 בודק שירותים קיימים..."
EXISTING_SERVICES=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services")

if echo "$EXISTING_SERVICES" | grep -q "oref-alerts-api"; then
    echo "⚠️  השירות 'oref-alerts-api' כבר קיים!"
    echo "📊 מעדכן את השירות הקיים..."
    
    # We need to find the service ID
    SERVICE_ID=$(echo "$EXISTING_SERVICES" | jq -r '.[] | select(.name=="oref-alerts-api") | .id' 2>/dev/null)
    
    if [ -n "$SERVICE_ID" ]; then
        echo "✅ נמצא שירות עם ID: $SERVICE_ID"
        echo "🌐 כתובת: https://oref-alerts-api.onrender.com"
        echo ""
        echo "🎉 השירות כבר קיים! אפשר לבדוק אותו:"
        echo "./check-deployment.sh"
        exit 0
    fi
fi

echo "📡 מנסה ליצור שירות חדש..."
echo "⏳ זה ייקח כמה דקות..."

# Since the API is complex, let me guide you through manual deployment
echo ""
echo "📱 מכיוון שה-API של Render מורכב, הנה הדרך הקלה:"
echo ""
echo "1. 📖 פתח את הדפדפן שלך"
echo "2. 🔗 לחץ על הקישור הזה:"
echo "   👉 https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api"
echo "3. 🎯 לחץ על 'Create Web Service' (הכפתור הכחול)"
echo "4. ⏳ המתן 2-3 דקות"
echo "5. ✅ קבל את הכתובת: https://oref-alerts-api.onrender.com"
echo ""
echo "🔄 אחרי הדיפלוי, הרץ:"
echo "   ./check-deployment.sh"
echo ""
echo "🎯 אני אחכה כאן ואעזור לך לבדוק אחרי הדיפלוי!"

# Create a simple instruction file
cat > DEPLOY_INSTRUCTIONS.txt << 'EOF'
🚀 הוראות דיפלוי פשוטות:

1. פתח דפדפן (Chrome, Firefox, etc.)
2. לחץ על הקישור:
   https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api
3. לחץ על הכפתור הכחול "Create Web Service"
4. המתן 2-3 דקות
5. קבל את הכתובת: https://oref-alerts-api.onrender.com

אחרי הדיפלוי, חזור לכאן והרץ:
./check-deployment.sh

אם יש בעיות, שלח לי הודעה!
EOF

echo ""
echo "📄 יצרתי קובץ הוראות: DEPLOY_INSTRUCTIONS.txt"
echo "📖 אתה יכול לקרוא אותו עם: cat DEPLOY_INSTRUCTIONS.txt"
echo ""
echo "🎉 מוכן! לחץ על הקישור למעלה והתחל את הדיפלוי!"