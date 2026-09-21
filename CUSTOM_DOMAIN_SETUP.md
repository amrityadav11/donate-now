# Custom Domain Setup for Backend API

## Goal
Set up `api.daansathi.online` to point to your Render backend at `donate-now-zu3l.onrender.com`

## Prerequisites
- Domain: `daansathi.com` (already on GoDaddy)
- Backend: Running on Render at `donate-now-zu3l.onrender.com`
- Vercel: Already configured

## Step 1: Add Custom Domain to Render

### 1.1 Login to Render Dashboard
1. Visit: https://dashboard.render.com
2. Select your service: `donate-now`

### 1.2 Add Custom Domain
1. In your Render service, look for **Settings** or **Custom Domain**
2. Click **Add Custom Domain**
3. Enter: `api.daansathi.online`
4. Click **Add Domain**

Render will show you:
```
Domain: api.daansathi.online
Status: Verification pending
CNAME record needed...
```

### 1.3 Copy the CNAME Record
Render will provide a CNAME record like:
```
Name: api.daansathi.online
Type: CNAME
Value: cname.onrender.com (or similar)
```

**Note:** Save this information!

## Step 2: Update DNS Records on GoDaddy

### 2.1 Login to GoDaddy
1. Visit: https://godaddy.com/account
2. Click on **Domains**
3. Select **daansathi.com**

### 2.2 Go to DNS Management
1. Click **Manage DNS** or **DNS**
2. You'll see a list of DNS records

### 2.3 Add CNAME Record for API Subdomain

Look for existing records (you should see A records for www, @, etc.)

**Add a new CNAME record:**
- **Name/Host:** `api` (just "api", not the full domain)
- **Type:** CNAME
- **Value/Points to:** `cname.onrender.com` (the value from Render)
- **TTL:** 3600 (default is fine)

Click **Save** or **Add Record**

### 2.4 (Alternative) If CNAME doesn't work, use A Record

If Render gives you an IP address instead:
- **Name/Host:** `api`
- **Type:** A
- **Value:** `{the-ip-address-from-render}`
- **TTL:** 3600

## Step 3: Verify DNS Propagation

### 3.1 Wait for DNS to Propagate
- DNS changes can take 15 minutes to 48 hours
- Usually updates within 5-30 minutes

### 3.2 Test the Custom Domain

**Option A: Using terminal**
```bash
# Windows PowerShell
nslookup api.daansathi.online

# Or use this online tool
# https://www.nslookup.io/
```

Should show it pointing to Render's IP/CNAME.

**Option B: Using browser**
1. Visit: `https://api.daansathi.online/health`
2. Should show: `{"success":true,"message":"Server is running"}`

### 3.3 Test visitor API specifically
```bash
curl https://api.daansathi.online/api/visitors/health
```

Should return:
```json
{"success":true,"message":"Visitor API is running"}
```

## Step 4: Update Vercel Environment Variable

### 4.1 Update VITE_API_URL
1. Go to: https://vercel.com/dashboard
2. Select `donate-now` project
3. **Settings** → **Environment Variables**
4. Edit `VITE_API_URL`
5. Change value to:
   ```
   https://api.daansathi.online/api
   ```
6. Click **Save**

### 4.2 Redeploy Vercel
1. Go to **Deployments** tab
2. Click latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

## Step 5: Test Everything

### 5.1 Test on Live Site
1. Visit: https://daansathi.online
2. Hard refresh: `Ctrl+Shift+R`
3. Open DevTools (F12)
4. Go to **Console** tab
5. Should see visitor tracking working

### 5.2 Check Network Requests
1. DevTools → **Network** tab
2. Reload page
3. Look for requests to `api.daansathi.online`
4. Should see `200 OK` responses

### 5.3 Verify Visitor Counter
1. Should see numbers on homepage
2. Should see "X Online • Y Total" in footer
3. No console errors

## Step 6: SSL/HTTPS Certificate

### 6.1 Render SSL (Automatic)
Render automatically provides SSL certificates for custom domains.
- Just wait a few minutes after DNS propagation
- `https://api.daansathi.online` will work automatically

### 6.2 Force HTTPS
If you want to force HTTPS (recommended):
1. In Render service settings
2. Look for **HTTPS** or **SSL** settings
3. Enable **Redirect HTTP to HTTPS**

## Troubleshooting

### Issue: DNS not propagating
**Solution:**
1. Wait 30 minutes to 2 hours
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Use incognito/private window to test
4. Try different browser

### Issue: 404 or Connection Refused
**Possible causes:**
1. DNS not yet propagated - wait longer
2. Render service not running - check Render dashboard
3. CNAME record incorrect - verify in GoDaddy
4. Wrong subdomain name - should be just "api"

**Check with:**
```bash
# Verify DNS is set up
nslookup api.daansathi.online

# Test API directly
curl https://api.daansathi.online/api/health
```

### Issue: SSL Certificate Error
**Solution:**
1. Wait 5-10 minutes after DNS propagation
2. Render generates certificate automatically
3. Hard refresh browser
4. Try in incognito window

### Issue: Still not working on Vercel
1. Make sure Vercel redeploy is complete
2. Hard refresh: `Ctrl+Shift+R`
3. Check DevTools → Network tab
4. Look for red errors
5. Check Vercel logs for deployment issues

## Checklist

- [ ] Added custom domain to Render
- [ ] Copied CNAME/A record from Render
- [ ] Added DNS record to GoDaddy
- [ ] Waited for DNS propagation (5-30 min)
- [ ] Tested `https://api.daansathi.online/api/health` in browser
- [ ] Updated VITE_API_URL in Vercel to `https://api.daansathi.online/api`
- [ ] Redeployed Vercel
- [ ] Visitor counter showing on daansathi.online
- [ ] No console errors in DevTools

## Final Setup Summary

| Component | Domain | Status |
|-----------|--------|--------|
| Frontend | daansathi.online (Vercel) | ✅ Already working |
| API Backend | api.daansathi.online (Render) | 🔄 Being configured |
| Database | MongoDB Atlas (Cloud) | ✅ Already working |

## Next: Visitor Tracking

Once custom domain is working:
1. Visitor tracking will automatically work
2. Real-time online/today/total counters will display
3. Footer will show compact visitor counter on all pages
4. No further changes needed!

## Support

If DNS isn't propagating after 48 hours:
1. Contact GoDaddy support
2. Ask them to verify CNAME record setup
3. They can help resolve DNS propagation issues

If Render custom domain has issues:
1. Check Render dashboard → service settings
2. Verify CNAME record matches exactly
3. Contact Render support (they're responsive)
