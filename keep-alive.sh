#!/bin/bash

# 🚀 Keep Oref Alerts API alive
# This script pings the service to prevent it from sleeping

SERVICE_URL="https://oref-alerts-api.onrender.com"
LOG_FILE="keep-alive.log"

echo "🔄 Keeping $SERVICE_URL alive..."
echo "Timestamp: $(date)" >> "$LOG_FILE"

# Ping health endpoint
echo "🔍 Pinging health endpoint..."
HEALTH_RESPONSE=$(curl -s -m 30 "$SERVICE_URL/health")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status // "unknown"' 2>/dev/null)

if [ "$HEALTH_STATUS" = "ok" ]; then
    echo "✅ Service is alive and healthy"
    echo "✅ $(date): Service healthy" >> "$LOG_FILE"
else
    echo "⚠️  Service might be sleeping or having issues"
    echo "⚠️  Response: $HEALTH_RESPONSE"
    echo "⚠️  $(date): Service issue - $HEALTH_RESPONSE" >> "$LOG_FILE"
    
    # Try to wake it up with a second request
    echo "🔄 Sending wake-up request..."
    curl -s -m 60 "$SERVICE_URL/api/alerts/current" > /dev/null
    sleep 2
    
    # Check again
    HEALTH_RESPONSE2=$(curl -s -m 30 "$SERVICE_URL/health")
    HEALTH_STATUS2=$(echo "$HEALTH_RESPONSE2" | jq -r '.status // "unknown"' 2>/dev/null)
    
    if [ "$HEALTH_STATUS2" = "ok" ]; then
        echo "✅ Service woke up successfully!"
        echo "✅ $(date): Service woke up" >> "$LOG_FILE"
    else
        echo "❌ Service still not responding"
        echo "❌ $(date): Service not responding" >> "$LOG_FILE"
    fi
fi

echo ""
echo "📊 Service Status:"
echo "   URL: $SERVICE_URL"
echo "   Health: $HEALTH_STATUS"
echo "   Time: $(date)"
echo ""
echo "📈 Logs saved to: $LOG_FILE"
echo "🔄 Run this script every 10 minutes to keep the service alive"