#!/bin/bash

# Test Render.com API access

RENDER_API_KEY="rnd_StoL99DZbfaLGdFkyRqxPahg7OpB"

echo "Testing Render.com API access..."
echo "API Key: ${RENDER_API_KEY:0:10}..."

# Test 1: List services
echo ""
echo "1. Testing: List services"
curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services" | jq -r 'length' | \
  xargs -I {} echo "Found {} services"

# Test 2: Get user info
echo ""
echo "2. Testing: Get user info"
curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/user" | jq -r '.email // "No email found"'

# Test 3: Check API key format
echo ""
echo "3. API Key analysis:"
echo "   Length: ${#RENDER_API_KEY} characters"
echo "   Prefix: ${RENDER_API_KEY:0:4}"
echo "   Expected prefix: 'rnd_'"

# Test 4: Try with different header format
echo ""
echo "4. Testing alternative header format..."
curl -s -H "Authorization: token $RENDER_API_KEY" \
  "https://api.render.com/v1/user" | jq -r '.email // "Alternative format failed"' 2>/dev/null || echo "Alternative format also failed"

echo ""
echo "📋 If all tests fail, the API key might be invalid or need regeneration."
echo "🔗 Generate new API key at: https://dashboard.render.com/account/api-keys"
echo "📚 API docs: https://render.com/docs/api"