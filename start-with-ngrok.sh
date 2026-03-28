#!/bin/bash

# סקריפט להרצת Oref API עם ngrok

echo "🚀 הרצת Oref Alerts API עם גישה ציבורית"
echo "========================================"

# בדוק אם השרת המקורי רץ
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ השרת המקורי לא רץ. מריץ..."
    node public-server.js &
    SERVER_PID=$!
    sleep 3
fi

# בדוק אם ngrok מותקן
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok לא מותקן. מתקין..."
    
    # הורד ngrok
    cd /tmp
    curl -L https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip -o ngrok.zip
    unzip -o ngrok.zip
    chmod +x ngrok
    sudo mv ngrok /usr/local/bin/
    
    echo "✅ ngrok הותקן"
    echo ""
    echo "⚠️  צריך auth token מ-https://ngrok.com"
    echo "1. היכנס ל-https://dashboard.ngrok.com/signup"
    echo "2. צור חשבון חינם"
    echo "3. קבל את ה-auth token שלך"
    echo "4. הרץ: ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    read -p "יש לך כבר auth token? (y/n): " has_token
    
    if [ "$has_token" = "y" ]; then
        read -p "הכנס את ה-auth token שלך: " ngrok_token
        ngrok config add-authtoken "$ngrok_token"
    else
        echo "❌ לא ניתן להמשיך ללא ngrok auth token"
        exit 1
    fi
fi

# הרץ ngrok
echo ""
echo "🌐 מריץ ngrok על פורט 3001..."
echo "📡 קבל את הכתובת הציבורית שלך למטה"
echo "========================================"

# הרץ ngrok בפורוגראונד
ngrok http 3001 --log stdout --log-format logfmt --log-level info

# אם ngrok נכשל, הצע אלטרנטיבות
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ngrok נכשל. אלטרנטיבות:"
    echo ""
    echo "1. Cloudflare Tunnel (חינם, HTTPS):"
    echo "   brew install cloudflared"
    echo "   cloudflared tunnel login"
    echo "   cloudflared tunnel create oref-api"
    echo "   cloudflared tunnel run oref-api"
    echo ""
    echo "2. Render.com (חינם, HTTPS, 24/7):"
    echo "   - דחוף את הקוד ל-GitHub"
    echo "   - היכנס ל-https://render.com"
    echo "   - לחץ 'New Web Service'"
    echo "   - בחר את ה-repository"
    echo ""
    echo "3. Railway.app (חינם, HTTPS):"
    echo "   npm i -g @railway/cli"
    echo "   railway up"
    echo ""
    echo "4. פתח פורט בפיירוול:"
    echo "   sudo ufw allow 3001/tcp"
    echo "   sudo ufw enable"
fi

# נקה
if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null
fi