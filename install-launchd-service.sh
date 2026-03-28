#!/bin/bash

# 🚀 Install launchd service for macOS to keep Oref API alive

echo "🚀 Installing launchd service for Oref Alerts API keep-alive..."
echo ""

SERVICE_NAME="com.oref.alerts.keepalive"
PLIST_FILE="com.oref.alerts.keepalive.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
FULL_PLIST_PATH="$LAUNCH_AGENTS_DIR/$PLIST_FILE"

# Make sure keep-alive.sh is executable
chmod +x keep-alive.sh

echo "📁 Current directory: $(pwd)"
echo "📄 Plist file: $PLIST_FILE"
echo "🎯 Service name: $SERVICE_NAME"
echo "📂 LaunchAgents directory: $LAUNCH_AGENTS_DIR"
echo ""

# Check if LaunchAgents directory exists
if [ ! -d "$LAUNCH_AGENTS_DIR" ]; then
    echo "📁 Creating LaunchAgents directory..."
    mkdir -p "$LAUNCH_AGENTS_DIR"
fi

# Copy plist file
echo "📋 Copying plist file to LaunchAgents..."
cp "$PLIST_FILE" "$FULL_PLIST_PATH"

# Load the service
echo "🔄 Loading launchd service..."
if launchctl list | grep -q "$SERVICE_NAME"; then
    echo "⚠️  Service already exists. Unloading first..."
    launchctl unload "$FULL_PLIST_PATH" 2>/dev/null || true
    sleep 1
fi

# Load the service
launchctl load "$FULL_PLIST_PATH"

# Start the service
echo "▶️  Starting service..."
launchctl start "$SERVICE_NAME"

echo ""
echo "✅ Service installed and started!"
echo ""
echo "📊 To check service status:"
echo "   launchctl list | grep $SERVICE_NAME"
echo ""
echo "📝 To view logs:"
echo "   tail -f keepalive-launchd.log"
echo "   tail -f keepalive-launchd-error.log"
echo ""
echo "🔄 Service will run every 10 minutes (600 seconds)"
echo ""
echo "🗑️  To remove the service:"
echo "   launchctl unload $FULL_PLIST_PATH"
echo "   rm $FULL_PLIST_PATH"
echo ""
echo "🎯 Your Oref API will now stay alive as long as this Mac is running!"
echo "🌐 Service URL: https://oref-alerts-api.onrender.com"