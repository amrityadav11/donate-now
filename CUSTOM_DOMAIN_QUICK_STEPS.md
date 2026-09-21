# Custom Domain Setup - Quick Steps (5 minutes)

## 🎯 Goal
Make `api.daansathi.online` work instead of `donate-now-zu3l.onrender.com`

## ⚡ Quick Steps

### Step 1: Render Dashboard (2 min)
```
1. Go to: https://dashboard.render.com
2. Click your service: "donate-now"
3. Click "Custom Domain" or "Settings"
4. Click "Add Custom Domain"
5. Type: api.daansathi.online
6. Click "Add"
7. COPY the CNAME value shown (like: cname.onrender.com)
```

### Step 2: GoDaddy DNS (2 min)
```
1. Go to: https://godaddy.com/account
2. Click "Domains" → "daansathi.com"
3. Click "Manage DNS"
4. Scroll down, find "Add Record" or "New Record"
5. Fill in:
   Name: api
   Type: CNAME
   Value: [paste the value from Render]
6. Click "Save"
```

### Step 3: Verify (1 min)
```
Wait 5-30 minutes for DNS to update, then:
1. Visit: https://api.daansathi.online/api/health
2. Should see: {"success":true,"message":"Server is running"}
```

### Step 4: Update Vercel (optional, already done)
```
If needed:
1. Go to: https://vercel.com/dashboard
2. Select "donate-now"
3. Settings → Environment Variables
4. Update VITE_API_URL to: https://api.daansathi.online/api
5. Redeploy
```

## ✅ Done!

Your custom domain is now set up. Visitor tracking will work automatically!

---

## 📋 Common Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Wait 5-30 min for DNS propagation |
| "404 Not Found" | Check CNAME record spelling in GoDaddy |
| "SSL Certificate Error" | Wait 5-10 min more, Render generates it automatically |
| Still not working | Hard refresh: `Ctrl+Shift+R` |

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- GoDaddy Account: https://godaddy.com/account
- Vercel Dashboard: https://vercel.com/dashboard
- Check DNS: https://www.nslookup.io/

## 📞 Help

If DNS doesn't work after 1 hour:
- GoDaddy Support: https://www.godaddy.com/help
- Render Support: https://render.com/support
