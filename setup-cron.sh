#!/bin/bash

# 🕐 Setup cron job to keep the service alive

echo "🕐 Setting up cron job to keep Oref Alerts API alive..."
echo ""

# Check if crontab exists
if ! command -v crontab &> /dev/null; then
    echo "❌ crontab not found. Installing cron..."
    
    # Try to install cron based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y cron
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "📝 On macOS, cron is usually installed. Use 'launchctl' instead."
    else
        echo "⚠️  Unknown OS. Please install cron manually."
    fi
fi

# Get the full path to keep-alive.sh
SCRIPT_PATH="$(pwd)/keep-alive.sh"
LOG_PATH="$(pwd)/keep-alive.log"

echo "📁 Script path: $SCRIPT_PATH"
echo "📄 Log path: $LOG_PATH"
echo ""

# Create the cron job entry
CRON_JOB="*/10 * * * * $SCRIPT_PATH >> $LOG_PATH 2>&1"

echo "📋 Cron job to add:"
echo "   $CRON_JOB"
echo ""

# Add to crontab
echo "🔧 Adding to crontab..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added!"
echo ""
echo "📊 To check your cron jobs:"
echo "   crontab -l"
echo ""
echo "🗑️  To remove this cron job:"
echo "   crontab -e"
echo "   (Then delete the line with keep-alive.sh)"
echo ""
echo "🎯 Alternative solutions if cron doesn't work:"
echo "   1. Use UptimeRobot (recommended): https://uptimerobot.com"
echo "   2. Use GitHub Actions (free)"
echo "   3. Use Render Cron Job (if upgrading to paid plan)"
echo ""
echo "🌐 Your service: https://oref-alerts-api.onrender.com"
echo "🔄 Will be pinged every 10 minutes"