#!/bin/bash

# Create Render.com service with correct owner ID

RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"
API_URL="https://api.render.com/v1"
OWNER_ID="tea-d74152juibrs73cn0240"  # From previous response
SERVICE_NAME="oref-alerts-api"
REPO_URL="https://github.com/nadavsimba24/oref-alerts-api"

echo "🚀 Creating Render.com service..."
echo "Owner ID: $OWNER_ID"
echo "Service: $SERVICE_NAME"
echo ""

# Create service payload with ownerID
SERVICE_PAYLOAD=$(cat << EOF
{
  "type": "web_service",
  "name": "$SERVICE_NAME",
  "ownerId": "$OWNER_ID",
  "autoDeploy": "yes",
  "repo": "$REPO_URL",
  "branch": "main",
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start",
  "plan": "starter",
  "region": "oregon",
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
EOF
)

echo "📦 Sending request to Render API..."
echo ""

RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$SERVICE_PAYLOAD" \
  "$API_URL/services")

echo "📄 API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Extract service ID
SERVICE_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null)

if [ -n "$SERVICE_ID" ]; then
    echo ""
    echo "🎉 SUCCESS! Service created!"
    echo "============================="
    echo "Service ID: $SERVICE_ID"
    echo "Service Name: $SERVICE_NAME"
    echo ""
    echo "🌐 Service URL:"
    echo "https://$SERVICE_NAME.onrender.com"
    echo ""
    echo "📊 Monitor deployment:"
    echo "https://dashboard.render.com/services/$SERVICE_ID"
    echo ""
    echo "⏳ Deployment will start automatically..."
    echo "Wait 2-3 minutes, then check:"
    echo "./check-deployment.sh"
    echo ""
    echo "🔧 Test endpoints:"
    echo "curl https://$SERVICE_NAME.onrender.com/health"
    echo "curl https://$SERVICE_NAME.onrender.com/api/alerts/current"
    
    # Save service ID to file
    echo "$SERVICE_ID" > .render-service-id
    echo ""
    echo "✅ Service ID saved to .render-service-id"
    
else
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.message // "Unknown error"' 2>/dev/null)
    echo ""
    echo "❌ Failed to create service: $ERROR_MSG"
    echo ""
    echo "💡 Manual deployment option:"
    echo "1. Open: https://dashboard.render.com/new/web"
    echo "2. Connect GitHub: $REPO_URL"
    echo "3. Click 'Create Web Service'"
    echo "4. render.yaml will auto-configure everything"
fi