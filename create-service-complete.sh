#!/bin/bash

# Complete Render.com service creation with all required fields

RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"
API_URL="https://api.render.com/v1"
OWNER_ID="tea-d74152juibrs73cn0240"
SERVICE_NAME="oref-alerts-api"
REPO_URL="https://github.com/nadavsimba24/oref-alerts-api"

echo "🚀 Creating Render.com service (complete version)..."
echo ""

# Complete service payload
SERVICE_PAYLOAD=$(cat << EOF
{
  "type": "web_service",
  "name": "$SERVICE_NAME",
  "ownerId": "$OWNER_ID",
  "repo": "$REPO_URL",
  "autoDeploy": true,
  "branch": "main",
  "serviceDetails": {
    "env": "node",
    "region": "oregon",
    "plan": "starter",
    "numInstances": 1,
    "buildCommand": "npm install && npm run build",
    "startCommand": "npm start",
    "healthCheckPath": "/health",
    "envVars": [
      {
        "key": "NODE_ENV",
        "value": "production"
      },
      {
        "key": "PORT",
        "value": "3000"
      },
      {
        "key": "CACHE_TTL_CURRENT",
        "value": "30"
      },
      {
        "key": "CACHE_TTL_HISTORY",
        "value": "300"
      }
    ]
  }
}
EOF
)

echo "📦 Sending creation request..."
echo ""

RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$SERVICE_PAYLOAD" \
  "$API_URL/services")

echo "📄 API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Check for success
SERVICE_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null)
SERVICE_URL=$(echo "$RESPONSE" | jq -r '.service.serviceDetails.url // empty' 2>/dev/null)

if [ -n "$SERVICE_ID" ]; then
    echo ""
    echo "🎉 🎉 🎉 SUCCESS! 🎉 🎉 🎉"
    echo "========================"
    echo "Service created successfully!"
    echo ""
    echo "📋 Service Details:"
    echo "   ID: $SERVICE_ID"
    echo "   Name: $SERVICE_NAME"
    
    if [ -n "$SERVICE_URL" ]; then
        echo "   URL: $SERVICE_URL"
    else
        echo "   URL: https://$SERVICE_NAME.onrender.com"
    fi
    
    echo ""
    echo "📊 Deployment started automatically!"
    echo "   Monitor: https://dashboard.render.com/services/$SERVICE_ID"
    echo ""
    echo "⏳ Estimated deployment time: 2-3 minutes"
    echo ""
    echo "🔧 Test after deployment:"
    echo "   ./check-deployment.sh"
    echo ""
    echo "   Or manually:"
    echo "   curl https://$SERVICE_NAME.onrender.com/health"
    echo "   curl https://$SERVICE_NAME.onrender.com/api/alerts/current"
    
    # Save service info
    echo "$SERVICE_ID" > .render-service-id
    echo "https://$SERVICE_NAME.onrender.com" > .render-service-url
    
    echo ""
    echo "✅ Service info saved to .render-service-id and .render-service-url"
    
    # Start monitoring deployment
    echo ""
    echo "🔄 Starting deployment monitor..."
    echo "   (Deployment will take a few minutes)"
    echo "   Run './check-deployment.sh' in 3 minutes"
    
else
    echo ""
    echo "❌ Service creation failed"
    echo ""
    echo "💡 Quick manual deployment:"
    echo "   1. Open: https://dashboard.render.com/new/web"
    echo "   2. Click 'Connect a GitHub repository'"
    echo "   3. Select: nadavsimba24/oref-alerts-api"
    echo "   4. Click 'Create Web Service'"
    echo ""
    echo "   ⚡ Fast track: https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api"
fi