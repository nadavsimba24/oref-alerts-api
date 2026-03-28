#!/bin/bash

# 🚀 Deploy now that GitHub is connected to Render

echo "🎯 GitHub is already connected to Render!"
echo "========================================="
echo ""
echo "📋 Current status:"
echo "   ✅ GitHub repository: connected"
echo "   ✅ render.yaml: ready"
echo "   🔄 Web Service: not created yet"
echo ""
echo "🚀 Ready to deploy Oref Alerts API!"
echo ""

# Show the direct link
echo "⚡ Quick deploy link:"
echo "👉 https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api"
echo ""
echo "📋 What will happen:"
echo "   1. Open the link above"
echo "   2. See auto-filled settings from render.yaml"
echo "   3. Click 'Create Web Service'"
echo "   4. Wait 2-3 minutes"
echo "   5. Get your API URL"
echo ""

# Create a simple HTML page with a button for easy clicking
cat > /tmp/deploy-button.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Deploy Oref Alerts API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .deploy-button {
            display: inline-block;
            background: #0070f3;
            color: white;
            padding: 20px 40px;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 10px;
            margin: 20px 0;
            transition: background 0.3s;
        }
        .deploy-button:hover {
            background: #0051cc;
        }
        .steps {
            text-align: left;
            margin: 30px 0;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
        }
        .step {
            margin: 10px 0;
            padding: 10px;
            border-left: 4px solid #0070f3;
        }
    </style>
</head>
<body>
    <h1>🚀 Deploy Oref Alerts API</h1>
    <p>GitHub is already connected to Render.com</p>
    
    <a href="https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api" 
       class="deploy-button" target="_blank">
       DEPLOY NOW
    </a>
    
    <div class="steps">
        <h2>📋 What happens next:</h2>
        <div class="step"><strong>1.</strong> Open Render.com with your repo pre-selected</div>
        <div class="step"><strong>2.</strong> See auto-filled settings from <code>render.yaml</code></div>
        <div class="step"><strong>3.</strong> Click "Create Web Service" (blue button)</div>
        <div class="step"><strong>4.</strong> Wait 2-3 minutes for deployment</div>
        <div class="step"><strong>5.</strong> Get your API URL: <code>https://oref-alerts-api.onrender.com</code></div>
    </div>
    
    <h2>🔧 After deployment:</h2>
    <p>Run this command to test:</p>
    <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
./check-deployment.sh</pre>
    
    <p>Or test manually:</p>
    <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
curl https://oref-alerts-api.onrender.com/health
curl https://oref-alerts-api.onrender.com/api/alerts/current</pre>
</body>
</html>
EOF

echo "📄 Created a simple web page with deploy button:"
echo "   file:///tmp/deploy-button.html"
echo ""
echo "💻 You can also run:"
echo "   open /tmp/deploy-button.html"
echo ""
echo "🎯 Or just click this link:"
echo "   https://dashboard.render.com/new/web?repo=https://github.com/nadavsimba24/oref-alerts-api"
echo ""
echo "⏱️ Estimated time: 3 minutes"
echo "💰 Cost: Free"
echo "🌐 Result: Public API at https://oref-alerts-api.onrender.com"