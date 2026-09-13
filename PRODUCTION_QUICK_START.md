# 🚀 DaanSathi Production Quick Start

**TL;DR Version** - Follow these steps to go live with daansathi.com

---

## **1️⃣ GET YOUR CREDENTIALS READY**

Gather these before starting:

```
✅ GoDaddy Account (domain: daansathi.com)
✅ Razorpay Account (switch to LIVE mode)
✅ MongoDB Atlas (production database)
✅ Gmail Account (for SMTP)
✅ GitHub Account (code repository)
```

---

## **2️⃣ CONFIGURE RAZORPAY (15 minutes)**

### Get Production Keys
1. Login to https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy **Production** keys (starts with `rzp_live_`)
4. Setup Webhook:
   - URL: `https://api.daansathi.com/api/payments/webhook`
   - Events: `payment.captured`, `payment.failed`

---

## **3️⃣ UPDATE CODE FOR PRODUCTION (30 minutes)**

### Backend Changes
```bash
# Update server/server.js - CORS
# Change: origin: true
# To:     origin: ['https://daansathi.com', 'https://www.daansathi.com']

# Update server/.env with:
RAZORPAY_KEY_ID=rzp_live_XXXXX
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/daansathi-prod
NODE_ENV=production
FRONTEND_URL=https://daansathi.com
```

### Frontend Changes
```bash
# Update client/.env with:
VITE_API_URL=https://api.daansathi.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXX
VITE_PLATFORM_FEE_PERCENTAGE=2
```

### Git Commit
```bash
git add .
git commit -m "chore: production configuration for daansathi.com"
git push origin main
```

---

## **4️⃣ DEPLOY FRONTEND (5 minutes)**

### Vercel
1. Visit https://vercel.com/dashboard
2. Import your repository
3. Add custom domain: `daansathi.com`
4. Set environment variables:
   ```
   VITE_API_URL=https://api.daansathi.com/api
   VITE_RAZORPAY_KEY_ID=rzp_live_XXXXX
   VITE_PLATFORM_FEE_PERCENTAGE=2
   ```
5. Click Deploy

---

## **5️⃣ DEPLOY BACKEND (10 minutes)**

### Render
1. Visit https://dashboard.render.com
2. Create New Web Service
3. Connect GitHub repository
4. Set environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://...daansathi-prod
   RAZORPAY_KEY_ID=rzp_live_XXXXX
   RAZORPAY_KEY_SECRET=xxxxx
   RAZORPAY_WEBHOOK_SECRET=xxxxx
   FRONTEND_URL=https://daansathi.com
   JWT_SECRET=generate-random-64-char-string
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=app-specific-password
   ```
5. Click Deploy

---

## **6️⃣ CONFIGURE DOMAINS (24+ hours)**

### GoDaddy DNS Settings

At https://godaddy.com → Domains → daansathi.com → DNS

Add these records:

```
RECORD TYPE    NAME              POINTS TO
───────────────────────────────────────────────────────
A              daansathi.com     76.76.19.48 (Vercel)
CNAME          www               cname.vercel-dns.com
CNAME          api               [render-domain-from-dashboard]
TXT            (verification)    [from-vercel-verification]
```

✅ DNS takes 24-48 hours to propagate

---

## **7️⃣ TEST PAYMENT FLOW (10 minutes)**

1. Visit https://daansathi.com
2. Click a campaign → "Donate"
3. Enter amount: ₹100
4. See fee breakdown:
   - Donation: ₹100
   - Platform Fee (2%): ₹2
   - **Total: ₹102**
5. Click checkout
6. Use test card: **4111 1111 1111 1111**
7. CVV: any 3 digits
8. Expiry: any future date
9. ✅ Payment succeeds
10. Check email receipt

---

## **8️⃣ CREATE ADMIN ACCOUNT**

1. Visit https://daansathi.com/admin/login
2. Default credentials:
   ```
   Email: admin@donation.com
   Password: admin123
   ```
3. ⚠️ **CHANGE PASSWORD IMMEDIATELY**

---

## **9️⃣ SETUP HOMEPAGE CONTENT**

Admin Dashboard → Settings:

- [ ] Upload organization logo
- [ ] Add hero section image
- [ ] Add about section
- [ ] Add testimonials (min 3)
- [ ] Add contact information
- [ ] Configure app download links

---

## **🔟 CREATE TEST CAMPAIGNS**

Admin Dashboard → Campaigns:

- [ ] Create at least 5 campaigns
- [ ] Set status to "active"
- [ ] Upload images
- [ ] Add descriptions
- [ ] Set goal amounts (₹10,000+)

---

## **GO LIVE! 🎉**

### Final Checklist
- [ ] Domain resolves (https://daansathi.com works)
- [ ] API responds (https://api.daansathi.com/api/health returns 200)
- [ ] Homepage loads
- [ ] Campaigns display
- [ ] Payment flow works end-to-end
- [ ] Email receipts send
- [ ] Admin panel accessible
- [ ] HTTPS working (lock icon visible)

### Monitor First 24 Hours
- Check Razorpay dashboard for payments
- Monitor error logs in Vercel & Render
- Verify email delivery
- Test from different devices

---

## **TROUBLESHOOTING QUICK FIXES**

### Campaigns not showing?
```bash
# Check campaigns have status='active' in database
# Verify API: https://api.daansathi.com/api/campaigns
```

### Payment fails?
```bash
# Verify rzp_live_ keys (NOT rzp_test_)
# Check webhook configured in Razorpay
# Verify RAZORPAY_WEBHOOK_SECRET in backend
```

### Emails not sending?
```bash
# Gmail app password needed (not regular password)
# 2FA must be enabled first
# Check spam folder
```

### Domain not working?
```bash
# DNS changes take 24-48 hours
# Check at: https://dnschecker.org
# Verify records at GoDaddy
```

### CORS errors?
```bash
# Frontend is daansathi.com
# Backend CORS must allow daansathi.com
# Restart backend after changing CORS
```

---

## **CRITICAL IMPORTANT!**

🔴 **DO NOT GO LIVE IF:**
- Using Razorpay TEST keys (rzp_test_)
- CORS not configured for daansathi.com
- Production database not set up
- Email service not tested
- Campaigns don't display
- Payment fails in testing

---

## **REFERENCE DOCUMENTS**

For detailed information:

1. **PRODUCTION_DEPLOYMENT_GUIDE.md** - Complete 10-step guide
2. **PRODUCTION_CODE_CHANGES.md** - All code modifications
3. **GO_LIVE_CHECKLIST.md** - Phase-by-phase checklist

---

## **SUPPORT LINKS**

- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Razorpay: https://razorpay.com/docs
- MongoDB: https://docs.mongodb.com
- GoDaddy: https://www.godaddy.com/help

---

## **SUCCESS METRICS**

After launch, track these:

```
✅ Uptime: >99%
✅ Payments processed: 10+
✅ Failed payment rate: <5%
✅ Page load time: <3 seconds
✅ Email delivery: 100%
✅ Admin access: Working
```

---

**🎊 Congratulations! DaanSathi is now LIVE! 🎊**

Monitor closely for the first week and optimize based on user feedback.

For questions, refer to the detailed deployment guides in the repository.
