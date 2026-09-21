# Vercel Environment Variables Setup

## Issue
Visitor tracking not working on daansathi.online (Vercel) because environment variables aren't configured.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: `donate-now` (or your project name)

### Step 2: Go to Project Settings
1. Click on your project name
2. Go to **Settings** tab
3. Click on **Environment Variables** (left sidebar)

### Step 3: Add Environment Variables

Add these variables:

#### Variable 1: API URL for Production
- **Name:** `VITE_API_URL`
- **Value:** `https://donate-now-zu3l.onrender.com/api`
- **Environments:** Select "Production" ✓

#### Variable 2: API URL for Preview
- **Name:** `VITE_API_URL`
- **Value:** `https://donate-now-zu3l.onrender.com/api`
- **Environments:** Select "Preview" ✓

#### Variable 3: Razorpay Key (if not already set)
- **Name:** `VITE_RAZORPAY_KEY_ID`
- **Value:** `rzp_test_T1ShzL7pR79oOo`
- **Environments:** All (default)

### Step 4: Redeploy

After adding variables:

**Option A: Automatic Redeploy**
1. Go to **Deployments** tab
2. Click on the most recent failed/current deployment
3. Click **Redeploy**

**Option B: Push to GitHub (Auto Deploy)**
```bash
git push origin main
```

This will trigger Vercel to rebuild with new environment variables.

### Step 5: Verify

1. Wait 2-3 minutes for deployment
2. Visit: https://daansathi.online (or your domain)
3. Open DevTools (F12)
4. Go to **Console** tab
5. Should see: "Recording visitor...", "Fetching visitor stats..."
6. Visitor counter should show numbers

## Alternative: Using Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Add environment variable
vercel env add VITE_API_URL

# When prompted, enter: https://donate-now-zu3l.onrender.com/api

# Redeploy with new variables
vercel --prod
```

## Environment Variables Needed

| Variable | Value | Where |
|----------|-------|-------|
| `VITE_API_URL` | `https://donate-now-zu3l.onrender.com/api` | Vercel (Frontend) |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_T1ShzL7pR79oOo` | Vercel (Frontend) |

## Check Backend (Render)

Make sure backend on Render is running:

1. Visit: https://render.com/dashboard
2. Select your service: `donate-now-zu3l`
3. Check if it says "Live" (green)

If not running:
1. Click the service
2. Click **Manual Deploy** → **Deploy latest commit**

## Verify API Connection

Test if frontend can reach backend:

1. Open browser DevTools (F12)
2. Console tab
3. Run this command:
```javascript
fetch('https://donate-now-zu3l.onrender.com/api/visitors/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should show:
```json
{"success":true,"message":"Visitor API is running"}
```

## Troubleshooting

### Issue: Still not showing after redeploy

1. **Hard refresh page:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

2. **Check browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty cache and hard refresh"

3. **Check Vercel logs:**
   - Vercel Dashboard → Deployments
   - Click on latest deployment
   - Go to Logs tab
   - Search for errors

4. **Check CORS:**
   - Backend should allow requests from daansathi.online
   - Already configured in `server/server.js`

### Issue: Backend says "Render is free tier"

Free tier Render instances spin down after 15 minutes of inactivity.

**Solution:** Upgrade to paid plan or configure uptime monitoring.

### Issue: API calls still going to localhost

1. Check `.env` file is committed:
   ```bash
   cat client/.env
   ```
   Should show: `VITE_API_URL=https://donate-now-zu3l.onrender.com/api`

2. Check Vercel environment variables are set (not .env.local)

3. Hard refresh and clear cache

## Quick Checklist

- [ ] Vercel environment variables added
- [ ] Backend (Render) is running
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Check console for "Recording visitor..." logs
- [ ] Visitor counter shows numbers
- [ ] Footer shows compact counter

## Still Need Help?

Check the VISITOR_TRACKING_SETUP.md for more detailed troubleshooting.

Common issues:
1. Environment variables not set → Add to Vercel
2. Backend offline → Redeploy on Render
3. Cached old build → Hard refresh
4. CORS blocked → Already configured, should work
