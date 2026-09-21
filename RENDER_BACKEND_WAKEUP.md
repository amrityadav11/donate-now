# Render Backend Wakeup Guide

## Problem
Visitor tracking isn't working because the Render backend is in "sleep mode" (free tier instances spin down after 15 minutes of inactivity).

## Solution

### Option 1: Manual Wakeup (Fastest - 2 minutes)

**Step 1: Go to Render Dashboard**
1. Visit: https://dashboard.render.com
2. Select your service: `donate-now`

**Step 2: Redeploy**
1. Click **Manual Deploy** button
2. Select **Deploy latest commit**
3. Wait 2-3 minutes for deployment to complete

**Step 3: Test**
```
Visit: https://api.daansathi.online/api/health

Should show: {"success":true,"message":"Server is running"}
```

**Step 4: Test Visitor API**
```
Visit: https://api.daansathi.online/api/visitors/health

Should show: {"success":true,"message":"Visitor API is running"}
```

### Option 2: Upgrade to Paid Plan (Permanent Solution)

1. Go to Render Dashboard
2. Select your service
3. Click **Settings**
4. Look for **Plan** section
5. Click **Upgrade to Paid** (starts at $7/month)
6. This keeps your backend always running (no more sleep mode)

## Why This Happens

- **Free Tier:** Spins down after 15 minutes of no requests
- **Paid Tier:** Always running, better performance
- **Cold Start:** When waking up, first request takes 20-30 seconds

## Quick Diagnosis

**Is backend down?**
```
Visit: https://api.daansathi.online/api/health
```

- ✅ Returns JSON → Backend is UP
- ❌ Connection refused → Backend is SLEEPING

## Permanent Fix - Set Up Monitoring

To keep backend always awake (free tier only):

### Using Uptime Monitor

1. Visit: https://uptimerobot.com (free service)
2. Sign up for free account
3. Click **Create Monitor**
4. Set up HTTP(S) monitor:
   - Name: `DaanSathi Backend`
   - URL: `https://api.daansathi.online/api/health`
   - Check interval: **5 minutes**
   - Check frequency: **Every 5 minutes**
5. Click **Create**

This will "ping" your backend every 5 minutes, keeping it from sleeping!

**Result:** Backend stays awake 24/7 (on free tier too)

## Quick Checklist

- [ ] Visited Render dashboard
- [ ] Clicked Manual Deploy
- [ ] Waited for deployment (2-3 min)
- [ ] Tested `https://api.daansathi.online/api/health`
- [ ] Visitor tracking now working on daansathi.online
- [ ] (Optional) Set up UptimeRobot to keep backend always running

## After Backend Wakeup

1. Hard refresh daansathi.online: `Ctrl+Shift+R`
2. Open DevTools (F12)
3. Go to Console
4. Should see: "Recording visitor...", "Fetching visitor stats..."
5. Visitor counter should show numbers ✓

## Recommended

For production site, I recommend:
- **Upgrade Render to paid plan** ($7/month) - better performance, no sleep mode
- **Or** Use UptimeRobot (free) - keeps free tier backend awake with pings

Both options work, but paid plan is more reliable for production.

## Support

- Render Help: https://render.com/docs
- Render Support: https://render.com/support
- UptimeRobot Help: https://uptimerobot.com/help
