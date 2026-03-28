#!/bin/bash

# 🚀 Render.com Auto-Deployment Script
# Uses Render API to deploy Oref Alerts API automatically

set -e

echo "🚀 Starting automatic deployment to Render.com..."
echo "=================================================="

# API Configuration
RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"
RENDER_API_URL="https://api.render.com/v1"
SERVICE_NAME="oref-alerts-api"
REPO_URL="https://github.com/nadavsimba24/oref-alerts-api"

echo "🔑 API Key: ${RENDER_API_KEY:0:10}..."
echo "📦 Service: $SERVICE_NAME"
echo "🔗 Repository: $REPO_URL"
echo ""

# Check if service already exists
echo "🔍 Checking if service '$SERVICE_NAME' already exists..."
EXISTING_SERVICE=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "$RENDER_API_URL/services?name=$SERVICE_NAME" | jq -r '.[0].id // empty')

if [ -n "$EXISTING_SERVICE" ]; then
    echo "⚠️  Service '$SERVICE_NAME' already exists (ID: $EXISTING_SERVICE)"
    echo "📊 Getting service details..."
    SERVICE_DETAILS=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
      "$RENDER_API_URL/services/$EXISTING_SERVICE")
    
    SERVICE_URL=$(echo "$SERVICE_DETAILS" | jq -r '.service.serviceDetails.url // empty')
    SERVICE_STATUS=$(echo "$SERVICE_DETAILS" | jq -r '.service.status // empty')
    
    echo "🌐 Service URL: $SERVICE_URL"
    echo "📊 Status: $SERVICE_STATUS"
    
    # Trigger manual deploy
    echo "🔄 Triggering manual deployment..."
    DEPLOY_RESPONSE=$(curl -s -X POST \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json" \
      "$RENDER_API_URL/services/$EXISTING_SERVICE/deploys")
    
    DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | jq -r '.id // empty')
    
    if [ -n "$DEPLOY_ID" ]; then
        echo "✅ Deployment triggered! Deploy ID: $DEPLOY_ID"
        echo "📊 Monitor at: https://dashboard.render.com/services/$EXISTING_SERVICE"
    else
        echo "❌ Failed to trigger deployment"
        echo "Response: $DEPLOY_RESPONSE"
    fi
    
else
    echo "🆕 Service '$SERVICE_NAME' not found. Creating new service..."
    
    # Create new service using render.yaml
    echo "📄 Using render.yaml configuration..."
    
    # First, check if we can create from repo
    echo "🔗 Checking repository access..."
    
    # Create service payload based on render.yaml
    SERVICE_PAYLOAD=$(cat << EOF
{
  "type": "web_service",
  "name": "$SERVICE_NAME",
  "repo": "$REPO_URL",
  "autoDeploy": true,
  "branch": "main",
  "serviceDetails": {
    "env": "node",
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

    echo "🚀 Creating new service..."
    CREATE_RESPONSE=$(curl -s -X POST \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$SERVICE_PAYLOAD" \
      "$RENDER_API_URL/services")
    
    NEW_SERVICE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.service.id // empty')
    
    if [ -n "$NEW_SERVICE_ID" ]; then
        echo "✅ Service created successfully! ID: $NEW_SERVICE_ID"
        echo "📊 Monitor at: https://dashboard.render.com/services/$NEW_SERVICE_ID"
        
        # Get service URL
        sleep 3
        SERVICE_DETAILS=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
          "$RENDER_API_URL/services/$NEW_SERVICE_ID")
        
        SERVICE_URL=$(echo "$SERVICE_DETAILS" | jq -r '.service.serviceDetails.url // empty')
        echo "🌐 Service URL will be: $SERVICE_URL (after deployment)"
        
    else
        echo "❌ Failed to create service"
        echo "Response: $CREATE_RESPONSE"
        echo ""
        echo "⚠️  Alternative: Create service manually via dashboard:"
        echo "   https://dashboard.render.com/new/web"
        echo "   Repository: $REPO_URL"
        echo "   Name: $SERVICE_NAME"
    fi
fi

echo ""
echo "📋 Next steps:"
echo "=============="
echo "1. Wait 2-3 minutes for deployment to complete"
echo "2. Check deployment logs at: https://dashboard.render.com"
echo "3. Test the API:"
echo "   - Health: https://$SERVICE_NAME.onrender.com/health"
echo "   - Current alerts: https://$SERVICE_NAME.onrender.com/api/alerts/current"
echo "4. Monitor WebSocket: ws://$SERVICE_NAME.onrender.com"
echo ""
echo "📚 Documentation:"
echo "   - OPEN_RENDER.md - Step-by-step guide"
echo "   - SETUP_GUIDE.md - Comprehensive setup guide"
echo ""
echo "🎉 Deployment process started!"