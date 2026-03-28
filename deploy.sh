#!/bin/bash

# 🚀 Oref Alerts API Deployment Script
# This script helps deploy the Oref Alerts API to Render.com

set -e

echo "🚀 Starting Oref Alerts API deployment process..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Check Git status
echo "📊 Checking Git status..."
if [ -d ".git" ]; then
    git status --short
    echo ""
    echo "📦 Current branch: $(git branch --show-current)"
    echo "🔗 Remote: $(git remote get-url origin 2>/dev/null || echo "No remote set")"
else
    echo "⚠️  Not a Git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Oref Alerts API"
    echo "✅ Git repository initialized"
fi

echo ""
echo "🔧 Checking project setup..."

# Check if TypeScript compiles
echo "📝 Testing TypeScript compilation..."
if npm run build 2>/dev/null; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed. Please fix errors before deployment."
    exit 1
fi

# Test the server locally
echo "🌐 Testing server locally..."
(npm run dev > /tmp/oref-test.log 2>&1 &)
SERVER_PID=$!
sleep 5
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server is running correctly"
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
else
    echo "❌ Server failed to start. Check /tmp/oref-test.log for details"
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
    exit 1
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. ✅ Project structure verified"
echo "2. ✅ TypeScript compilation works"
echo "3. ✅ Server runs locally"
echo ""
echo "4. 🔗 GitHub repository: https://github.com/nadavsimba24/oref-alerts-api"
echo "5. 🎯 Render.com deployment guide: OPEN_RENDER.md"
echo "6. ⚡ Quick deploy guide: QUICK_DEPLOY.md"
echo ""
echo "🚀 Next steps:"
echo "=============="
echo "1. Push to GitHub (if not already):"
echo "   git add . && git commit -m 'Ready for deployment' && git push origin main"
echo ""
echo "2. Deploy to Render.com:"
echo "   - Go to: https://dashboard.render.com/new/web"
echo "   - Connect GitHub repository"
echo "   - Select: nadavsimba24/oref-alerts-api"
echo "   - Use settings from render.yaml"
echo "   - Click 'Create Web Service'"
echo ""
echo "3. Wait 2-3 minutes for deployment"
echo ""
echo "4. Test your API:"
echo "   https://your-service-name.onrender.com/health"
echo "   https://your-service-name.onrender.com/api/alerts/current"
echo ""
echo "📚 Documentation files available:"
echo "   - OPEN_RENDER.md - Step-by-step with screenshots"
echo "   - QUICK_DEPLOY.md - Quick reference"
echo "   - DEPLOY_NOW.md - Immediate deployment guide"
echo "   - RENDER_DEPLOYMENT.md - Detailed deployment guide"

echo ""
echo "🎉 Ready for deployment! Follow the instructions above."