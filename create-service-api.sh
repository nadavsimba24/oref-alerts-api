#!/bin/bash

# Create Render.com service using their API
# Based on Render API documentation

RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"
API_URL="https://api.render.com/v1"

echo "🚀 Creating Render.com service via API..."
echo "Using API key: ${RENDER_API_KEY:0:10}..."

# First, let's try to get the owner ID (user or team)
echo ""
echo "🔍 Getting account information..."
ACCOUNT_INFO=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "$API_URL/owners")

echo "Account info: $ACCOUNT_INFO"

# If that doesn't work, let's try the services endpoint directly
echo ""
echo "🔄 Trying direct service creation..."

# Create service payload
SERVICE_PAYLOAD='{
  "type": "web_service",
  "name": "oref-alerts-api",
  "autoDeploy": "yes",
  "repo": "https://github.com/nadavsimba24/oref-alerts-api",
  "branch": "main",
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start",
  "plan": "starter",
  "region": "oregon"
}'

echo "Payload: $SERVICE_PAYLOAD"

# Try to create service
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$SERVICE_PAYLOAD" \
  "$API_URL/services")

echo ""
echo "API Response:"
echo "$RESPONSE"

# Check if we got a service ID
SERVICE_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null)

if [ -n "$SERVICE_ID" ]; then
    echo ""
    echo "✅ Service created successfully!"
    echo "Service ID: $SERVICE_ID"
    echo ""
    echo "🌐 Service will be available at:"
    echo "https://oref-alerts-api.onrender.com"
    echo ""
    echo "📊 Monitor deployment at:"
    echo "https://dashboard.render.com/services/$SERVICE_ID"
else
    echo ""
    echo "❌ Failed to create service via API"
    echo ""
    echo "💡 Alternative: Manual deployment"
    echo "1. Go to: https://dashboard.render.com/new/web"
    echo "2. Connect GitHub repository"
    echo "3. Select: nadavsimba24/oref-alerts-api"
    echo "4. Click 'Create Web Service'"
    echo ""
    echo "📚 The render.yaml file will auto-configure everything."
fi