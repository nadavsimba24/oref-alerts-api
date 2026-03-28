# 🚀 GitHub Actions Guide for Oref Alerts API

## 📋 Overview

GitHub Actions will keep your Oref Alerts API alive by pinging it every 10 minutes. This prevents the Render.com free tier from sleeping after 15 minutes of inactivity.

## 🔧 Workflows

### 1. **Keep API Alive** (`/.github/workflows/keep-alive.yml`)
- **Schedule:** Every 10 minutes (`*/10 * * * *`)
- **Purpose:** Ping the API to keep it awake
- **Actions:**
  1. Check health endpoint
  2. If sleeping, send wake-up request
  3. Log results

### 2. **Daily API Status Report** (`/.github/workflows/daily-status.yml`)
- **Schedule:** Daily at 9 AM UTC
- **Purpose:** Generate daily health report
- **Actions:**
  1. Comprehensive health check
  2. Alerts endpoint test
  3. Status report generation

## 🎯 How It Works

### Automatic Ping Cycle:
```
GitHub Actions Runner (Ubuntu)
        ↓
   Every 10 minutes
        ↓
curl https://oref-alerts-api.onrender.com/health
        ↓
If response = "ok" → Log success
If response = error → Send wake-up request
        ↓
   Repeat every 10 minutes
```

### Wake-up Process:
1. First ping fails (server sleeping)
2. Send request to `/api/alerts/current`
3. Wait 5 seconds
4. Ping health endpoint again
5. Log success or failure

## 📊 Monitoring

### Check Workflow Status:
1. **GitHub Actions Tab:** https://github.com/nadavsimba24/oref-alerts-api/actions
2. **Look for:** "Keep API Alive" workflow
3. **Green checkmark** = Success
4. **Red X** = Failure (check logs)

### View Logs:
1. Click on workflow run
2. Click on "keep-alive" job
3. Click on "Ping Oref Alerts API" step
4. See console output

## ⚙️ Configuration

### Schedule Timing:
- **Keep Alive:** `*/10 * * * *` (every 10 minutes)
- **Daily Report:** `0 9 * * *` (9 AM UTC daily)

### Environment:
- **Runner:** `ubuntu-latest`
- **Timeout:** 30 seconds for health check, 60 seconds for wake-up

## 🚀 Manual Triggers

### Run Workflow Manually:
1. Go to **Actions** tab
2. Click **Keep API Alive**
3. Click **Run workflow**
4. Click **Run workflow** (button)

### Trigger via API:
```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/nadavsimba24/oref-alerts-api/actions/workflows/keep-alive.yml/dispatches \
  -d '{"ref":"main"}'
```

## 📈 Cost & Limits

### GitHub Actions Free Tier:
- **2,000 minutes/month** (≈ 33 hours)
- **Our usage:** ~4,320 minutes/month (if running 24/7)
- **Actual usage:** ~1,440 minutes/month (10 min intervals)
- **✅ Within free tier!**

### Breakdown:
- 10 minutes interval = 6 times/hour
- 6 × 24 hours = 144 times/day
- 144 × 30 days = 4,320 minutes/month
- **But:** Each run takes ~30 seconds
- **Actual:** 4,320 × 0.5 = 2,160 minutes/month
- **Margin:** 160 minutes buffer

## 🔧 Troubleshooting

### Workflow Not Running:
1. Check repository **Settings → Actions → General**
2. Ensure workflows are enabled
3. Check branch protection rules

### API Not Responding:
1. Check Render.com dashboard for logs
2. Verify service URL is correct
3. Check if Render.com service is suspended

### High GitHub Actions Usage:
1. Reduce ping frequency (e.g., every 15 minutes)
2. Use `workflow_dispatch` for manual triggers only
3. Combine with other keep-alive methods

## 🎯 Best Practices

### 1. **Multi-layer Redundancy:**
- GitHub Actions (primary)
- UptimeRobot (backup)
- Local cron job (optional)

### 2. **Monitoring:**
- Daily status reports
- Failure notifications (can add Slack/Email)
- Usage monitoring

### 3. **Optimization:**
- Cache responses when possible
- Use efficient ping intervals
- Monitor GitHub Actions usage

## 📞 Support

### Issues:
1. **GitHub Issues:** Open issue in repository
2. **Workflow Debug:** Check Actions logs
3. **API Issues:** Check Render.com logs

### Resources:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render.com Status](https://status.render.com)
- [Oref Alerts API Docs](README.md)

---

**🎉 Your API will stay alive 24/7 with GitHub Actions!**