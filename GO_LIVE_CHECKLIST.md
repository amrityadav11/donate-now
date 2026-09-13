# ✅ DaanSathi Go-Live Checklist

Quick reference checklist for deploying DaanSathi to production.

---

## **PHASE 1: PRE-DEPLOYMENT (1-2 Days Before)**

### Domain & DNS Configuration
- [ ] Purchase/access daansathi.com at GoDaddy
- [ ] Add custom domain in Vercel (daansathi.com)
- [ ] Add custom domain in Render (api.daansathi.com)
- [ ] Configure DNS records at GoDaddy:
  - [ ] A record for daansathi.com pointing to Vercel
  - [ ] CNAME for www → cname.vercel-dns.com
  - [ ] CNAME for api → render-provided-domain
- [ ] Verify DNS propagation (can take 24 hours)

### Razorpay Production Setup
- [ ] Login to Razorpay Dashboard
- [ ] Switch to production mode
- [ ] Get production API keys (rzp_live_...)
- [ ] Configure bank account for settlements
- [ ] Setup webhook: `https://api.daansathi.com/api/payments/webhook`
- [ ] Copy webhook secret

### Backend Configuration
- [ ] Update `server/server.js` CORS for daansathi.com
- [ ] Update `.env` with production MongoDB URI
- [ ] Update `.env` with production Razorpay keys
- [ ] Update `.env` with Gmail app password
- [ ] Update `.env` with production JWT secret
- [ ] Update `.env` with FRONTEND_URL=https://daansathi.com

### Frontend Configuration
- [ ] Update `client/.env` with production API URL
- [ ] Update `client/.env` with production Razorpay key
- [ ] Add platform fee percentage (2%)

### Vercel Deployment
- [ ] Connect repository to Vercel
- [ ] Set environment variables in Vercel
- [ ] Build succeeds (npm run build)
- [ ] Preview works

### Render Deployment
- [ ] Create Render account and service
- [ ] Connect repository
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Verify `/api/health` endpoint works

### Database
- [ ] Use production MongoDB (separate from dev)
- [ ] Backup configured
- [ ] IP whitelist updated to include Render

### Email Service
- [ ] Gmail SMTP configured
- [ ] 2-factor authentication enabled
- [ ] App password generated
- [ ] Test email sending from backend

---

## **PHASE 2: TESTING (1 Day Before)**

### Frontend Testing
- [ ] Homepage loads without errors
- [ ] Campaigns display correctly
- [ ] Categories show up
- [ ] Dark mode toggles
- [ ] Mobile responsive (test on phone)
- [ ] Navigation works
- [ ] Links are not broken

### Admin Panel Testing
- [ ] Can login at `/admin/login`
- [ ] Can create campaigns
- [ ] Can edit campaigns
- [ ] Can approve campaigns
- [ ] Can manage categories
- [ ] Can configure homepage

### Payment Flow Testing
- [ ] Navigate to campaign
- [ ] Click "Donate" button
- [ ] Donation form displays
- [ ] Can enter amount
- [ ] Platform fee shows in breakdown
- [ ] Proceed to checkout
- [ ] Razorpay modal appears
- [ ] Use test card: 4111 1111 1111 1111
- [ ] Payment processes successfully
- [ ] Success page shows
- [ ] Email receipt received
- [ ] Donation appears in admin dashboard

### API Testing
```bash
# Test health
curl https://api.daansathi.com/api/health

# Test get campaigns
curl https://api.daansathi.com/api/campaigns

# Test get categories
curl https://api.daansathi.com/api/categories
```

### Security Testing
- [ ] HTTPS working (check lock icon)
- [ ] Admin requires login
- [ ] JWT tokens working
- [ ] Can't access admin routes without auth
- [ ] CORS configured correctly

### Error Handling
- [ ] Test with invalid payment
- [ ] Test network error scenarios
- [ ] Test database error handling
- [ ] Check error messages display correctly

---

## **PHASE 3: CONTENT & DATA SETUP (1 Day Before)**

### Admin Account
- [ ] Create production admin account
- [ ] Secure password set
- [ ] Verified email configured

### Homepage Content
- [ ] Hero section banner added
- [ ] About section configured
- [ ] Contact information updated
- [ ] App download links added (if applicable)
- [ ] Testimonials added (minimum 3)

### Categories
- [ ] At least 5 categories created
- [ ] Icons assigned
- [ ] Description added

### Campaigns
- [ ] Minimum 10 campaigns created
- [ ] Status set to "active"
- [ ] Images uploaded
- [ ] Descriptions compelling and complete
- [ ] Goal amounts reasonable
- [ ] End dates set appropriately

### Logo & Branding
- [ ] Organization logo configured
- [ ] Colors match DaanSathi brand
- [ ] Favicon set
- [ ] Meta tags updated

---

## **PHASE 4: LAUNCH DAY**

### Morning Pre-Launch (1 hour before)
- [ ] Final full test of donation flow
- [ ] Check admin dashboard
- [ ] Verify email sending works
- [ ] Monitor error logs
- [ ] All systems green

### Launch Moment
- [ ] Announce on social media
- [ ] Send to first users
- [ ] Monitor Razorpay dashboard for payments
- [ ] Monitor Vercel analytics
- [ ] Monitor Render logs

### Immediate Post-Launch (First 2 hours)
- [ ] Stay on standby for issues
- [ ] Monitor error logs
- [ ] Check payment processing
- [ ] Verify email receipts sending
- [ ] Test from different device/network
- [ ] Check Razorpay for any declined payments

---

## **PHASE 5: FIRST 24 HOURS**

### Monitoring
- [ ] Check analytics dashboard
- [ ] Review error logs hourly
- [ ] Monitor Razorpay transactions
- [ ] Verify email delivery
- [ ] Check admin panel access

### Optimization
- [ ] Monitor page load times
- [ ] Check API response times
- [ ] Review error patterns
- [ ] Optimize if needed

### User Support
- [ ] Monitor social media comments
- [ ] Respond to any user issues
- [ ] Track failed payments
- [ ] Monitor support emails

### Metrics to Track
- [ ] Total donations processed
- [ ] Average donation amount
- [ ] Failed payment rate (should be < 5%)
- [ ] Page load time (should be < 3s)
- [ ] API response time (should be < 500ms)

---

## **PHASE 6: FIRST WEEK**

### Daily Monitoring
- [ ] Razorpay dashboard check
- [ ] Error logs review
- [ ] Analytics review
- [ ] Performance metrics
- [ ] User feedback

### Optimization Tasks
- [ ] Optimize slow pages
- [ ] Fix any reported bugs
- [ ] Improve UX based on feedback
- [ ] Update content if needed

### Documentation
- [ ] Document setup process
- [ ] Create user FAQ
- [ ] Document troubleshooting

### Scaling Preparation
- [ ] Test with higher traffic
- [ ] Verify rate limiting works
- [ ] Check database performance
- [ ] Prepare for scaling if needed

---

## **CRITICAL IMPORTANT REMINDERS**

⚠️ **BEFORE GOING LIVE, MAKE SURE:**

1. **Use Production Razorpay Keys (rzp_live_)**
   - NOT test keys (rzp_test_)
   - Otherwise payments won't process

2. **Update CORS for daansathi.com**
   - Frontend requests must come from daansathi.com
   - Otherwise you'll get CORS errors

3. **Use Production Database**
   - NOT development database
   - Otherwise you'll lose data or mix dev/prod

4. **Verify Email Service**
   - Gmail SMTP configured
   - App password generated (not regular password)
   - Test before launch

5. **Backup Everything**
   - Database backups enabled
   - Code in GitHub
   - Environment variables saved securely

6. **SSL/HTTPS Active**
   - Both daansathi.com and api.daansathi.com must use HTTPS
   - Automatic with Vercel & Render

7. **Environment Variables Set**
   - All production variables configured
   - No sensitive data in code

---

## **GO/NO-GO DECISION**

### ✅ GO if:
- [ ] All tests pass
- [ ] No critical errors
- [ ] DNS propagated
- [ ] Payment flow works
- [ ] Email sending works
- [ ] Admin panel works
- [ ] Campaigns display
- [ ] Mobile responsive

### ❌ NO-GO if:
- [ ] Any critical feature broken
- [ ] Payment fails
- [ ] DNS not propagated
- [ ] HTTPS not working
- [ ] Database connection issues
- [ ] Email not sending

---

## **POST-LAUNCH SUPPORT**

If issues occur:

1. **Payment not processing?**
   - Check Razorpay API keys are production (rzp_live_)
   - Verify webhook configured
   - Check rate limiting isn't blocking

2. **Campaigns not showing?**
   - Verify campaigns have status='active'
   - Check database connection
   - Verify API returning data

3. **Email not sending?**
   - Check Gmail app password
   - Verify EMAIL_USER environment variable
   - Check Gmail "Less secure app access"

4. **Domain not resolving?**
   - DNS changes take 24-48 hours
   - Check GoDaddy DNS records
   - Use dnschecker.org to verify

5. **CORS errors?**
   - Verify CORS configured for daansathi.com
   - Check browser console for exact error
   - Restart backend after CORS change

6. **Performance issues?**
   - Check Vercel analytics
   - Review Render logs
   - Optimize slow endpoints
   - Check database indexes

---

## **Quick Reference Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Razorpay Dashboard:** https://dashboard.razorpay.com
- **GoDaddy Domain Manager:** https://account.godaddy.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub:** https://github.com

---

## **Success Metrics (First Week)**

Track these numbers:

| Metric | Target | Actual |
|--------|--------|--------|
| Total Donations | 10+ | |
| Avg Donation | ₹500+ | |
| Success Rate | >95% | |
| Failed Payments | <5% | |
| Uptime | >99% | |
| Page Load Time | <3s | |
| Email Delivery | 100% | |

---

## **Sign-Off**

When all checks are complete and tested:

```
Date: _______________
Tester Name: _______________
Signature: _______________

Status: ☐ APPROVED TO LAUNCH  ☐ HOLD / FIX ISSUES
```

---

**You're ready to go live with DaanSathi! 🚀**

For detailed instructions, refer to `PRODUCTION_DEPLOYMENT_GUIDE.md`
