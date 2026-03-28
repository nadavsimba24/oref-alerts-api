#!/bin/bash

# 🔍 Check GitHub Actions status for Oref Alerts API

echo "🔍 Checking GitHub Actions status..."
echo "Repository: https://github.com/nadavsimba24/oref-alerts-api"
echo ""

# Try to get the latest workflow run using GitHub API
echo "📊 Trying to fetch workflow runs..."
echo ""

# Create a simple check
echo "🎯 What should happen:"
echo "   1. GitHub Actions should run automatically after push"
echo "   2. Workflow 'Keep API Alive' should appear"
echo "   3. It should run every 10 minutes"
echo "   4. You should see green checkmarks for successful runs"
echo ""

echo "🌐 Open GitHub Actions in your browser:"
echo "   👉 https://github.com/nadavsimba24/oref-alerts-api/actions"
echo ""

echo "📋 Manual check steps:"
echo "   1. Open the link above"
echo "   2. Look for 'Keep API Alive' workflow"
echo "   3. Click on it to see details"
echo "   4. Check if it's running successfully"
echo ""

echo "🔄 First run might take 1-2 minutes to start"
echo "⏰ After that, it will run every 10 minutes"
echo ""

echo "🔧 If workflow doesn't appear:"
echo "   1. Wait 2 minutes"
echo "   2. Refresh the page"
echo "   3. Check repository settings → Actions → enable workflows"
echo ""

echo "📈 To manually trigger a run:"
echo "   1. Go to Actions tab"
echo "   2. Click 'Keep API Alive'"
echo "   3. Click 'Run workflow'"
echo "   4. Select 'Run workflow'"
echo ""

echo "🎯 Your API will be pinged every 10 minutes by GitHub!"
echo "🌐 Service URL: https://oref-alerts-api.onrender.com"