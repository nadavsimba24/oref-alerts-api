#!/bin/bash

# 🔍 Check Oref Alerts API deployment status
# Run this after deploying to Render.com

SERVICE_NAME="oref-alerts-api"
SERVICE_URL="https://$SERVICE_NAME.onrender.com"

echo "🔍 Checking Oref Alerts API deployment..."
echo "Service URL: $SERVICE_URL"
echo ""

# Check if service is reachable
echo "1. 🔌 Testing connection..."
if ping -c 1 -t 2 "$SERVICE_NAME.onrender.com" > /dev/null 2>&1; then
    echo "   ✅ Service is reachable"
else
    echo "   ⚠️  Service might be starting up (ping failed)"
fi

# Test health endpoint
echo ""
echo "2. 🩺 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -m 10 "$SERVICE_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status // "unknown"' 2>/dev/null)
    TIMESTAMP=$(echo "$HEALTH_RESPONSE" | jq -r '.timestamp // "unknown"' 2>/dev/null)
    
    if [ "$STATUS" = "ok" ]; then
        echo "   ✅ Health check PASSED"
        echo "   📅 Timestamp: $TIMESTAMP"
    else
        echo "   ⚠️  Health check returned: $STATUS"
        echo "   📄 Response: $HEALTH_RESPONSE"
    fi
else
    echo "   ❌ Health endpoint not reachable"
    echo "   💡 The service might still be deploying"
fi

# Test alerts endpoint
echo ""
echo "3. 🚨 Testing alerts endpoint..."
ALERTS_RESPONSE=$(curl -s -m 10 "$SERVICE_URL/api/alerts/current" 2>/dev/null)
if [ $? -eq 0 ]; then
    ALERT_STATUS=$(echo "$ALERTS_RESPONSE" | jq -r '.alert // "unknown"' 2>/dev/null)
    
    if [ "$ALERT_STATUS" = "true" ] || [ "$ALERT_STATUS" = "false" ]; then
        echo "   ✅ Alerts endpoint WORKING"
        echo "   📊 Alert status: $ALERT_STATUS"
        
        # Show cities if available
        CITIES=$(echo "$ALERTS_RESPONSE" | jq -r '.current.data | join(", ")' 2>/dev/null)
        if [ "$CITIES" != "null" ] && [ -n "$CITIES" ]; then
            echo "   🏙️  Cities: $CITIES"
        fi
    else
        echo "   ⚠️  Alerts endpoint returned unexpected data"
        echo "   📄 Response (first 200 chars): ${ALERTS_RESPONSE:0:200}..."
    fi
else
    echo "   ⚠️  Alerts endpoint not reachable yet"
fi

# Test WebSocket (basic check)
echo ""
echo "4. 📡 Testing WebSocket availability..."
# Try to check if port 443 is open for WebSocket
if nc -z -G 2 "$SERVICE_NAME.onrender.com" 443 2>/dev/null; then
    echo "   ✅ Port 443 (HTTPS/WebSocket) is open"
else
    echo "   ⚠️  Cannot verify WebSocket port"
fi

echo ""
echo "📋 Deployment Status Summary:"
echo "============================="

if [ "$STATUS" = "ok" ] && [ -n "$ALERTS_RESPONSE" ]; then
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 Your API is live at:"
    echo "   $SERVICE_URL"
    echo ""
    echo "🔗 Endpoints:"
    echo "   • $SERVICE_URL/health"
    echo "   • $SERVICE_URL/api/alerts/current"
    echo "   • $SERVICE_URL/api/alerts/history"
    echo "   • $SERVICE_URL/api/alerts/cities"
    echo "   • $SERVICE_URL/api/alerts/regions"
    echo ""
    echo "📡 WebSocket:"
    echo "   • ws://$SERVICE_NAME.onrender.com"
    echo ""
    echo "📊 Next steps:"
    echo "   1. Bookmark your service URL"
    echo "   2. Test with real applications"
    echo "   3. Monitor at: https://dashboard.render.com"
    
elif [ "$STATUS" = "ok" ]; then
    echo "⚠️  PARTIAL SUCCESS - Health check works but alerts might need time"
    echo "   💡 Wait 1-2 minutes and run this script again"
    
else
    echo "⏳ DEPLOYMENT IN PROGRESS OR FAILED"
    echo "   💡 Check Render.com dashboard for logs:"
    echo "   https://dashboard.render.com"
    echo ""
    echo "   Common issues:"
    echo "   • Build taking longer than expected"
    echo "   • Dependencies failing to install"
    echo "   • TypeScript compilation errors"
    echo "   • Port binding issues"
fi

echo ""
echo "🔄 To re-run this check:"
echo "   ./check-deployment.sh"
echo ""
echo "📚 For help, see: SETUP_GUIDE.md or OPEN_RENDER.md"