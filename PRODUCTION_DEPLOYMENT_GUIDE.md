# 🚀 DaanSathi Production Deployment Guide

Complete guide to deploy DaanSathi to production with daansathi.com domain for public use with platform fees.

---

## **STEP 1: Configure Domain daansathi.com with DNS**

### **1.1 Frontend Deployment (Vercel)**

1. **Add custom domain in Vercel:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Domains
   - Add domain: `daansathi.com`

2. **Configure DNS at GoDaddy:**
   - Login to GoDaddy
   - Go to your domain management
   - Navigate to DNS settings
   - Add these DNS records:

```
TYPE    NAME              VALUE (from Vercel)
A       daansathi.com     76.76.19.48
CNAME   www               cname.vercel-dns.com
TXT     _verification     verification-code-from-vercel
```

3. **Verify domain connection:**
   - Vercel will auto-verify within 24 hours
   - Once verified, HTTPS will auto-activate

### **1.2 Backend Deployment (Render)**

1. **Add custom domain in Render:**
   - Go to https://dashboard.render.com
   - Select your backend service
   - Go to Settings → Custom Domain
   - Add domain: `api.daansathi.com`

2. **Configure DNS at GoDaddy:**
   - Add CNAME record:
   ```
   TYPE    NAME              VALUE
   CNAME   api               [render-provided-domain]
   ```

3. **Important:** Update backend CORS settings:
   - Update `server/server.js` CORS to accept daansathi.com

---

## **STEP 2: SSL/HTTPS Setup**

✅ **Automatic** - No action needed
- Vercel provides free SSL for custom domains
- Render provides free SSL for custom domains
- Both auto-renew

---

## **STEP 3: Razorpay Production Mode Setup**

### **3.1 Switch to Production Keys**

1. **Login to Razorpay Dashboard:** https://dashboard.razorpay.com

2. **Get Production API Keys:**
   - Settings → API Keys
   - Copy Production Key ID (starts with `rzp_live_`)
   - Copy Production Key Secret

3. **Important Settings:**
   - Go to Account Settings
   - Enable "Settled to Bank Account"
   - Configure bank details for fund transfers

### **3.2 Configure Platform Fees**

**Option 1: Charge Fee at Checkout (Recommended)**

The frontend adds platform fee to donation amount:
- If user donates ₹100 with 2% platform fee
- Charge: ₹102 to user via Razorpay
- Platform keeps: ₹2
- Charity receives: ₹100 (after Razorpay fees)

**Option 2: Deduct Fee from Donation (Alternative)**

The backend deducts platform fee from proceeds:
- User donates: ₹100
- Razorpay fee: ~2.9% = ₹2.90
- Platform fee: 2% = ₹2.00
- Charity receives: ₹95.10

### **3.3 Setup Webhook for Payment Verification**

1. **In Razorpay Dashboard:**
   - Settings → Webhooks
   - Add Webhook URL: `https://api.daansathi.com/api/payments/webhook`
   - Select events:
     - `payment.captured`
     - `payment.failed`
     - `payment.authorized`
   - Copy Webhook Secret

2. **Update Environment:**
   - Add `RAZORPAY_WEBHOOK_SECRET` to Render environment

---

## **STEP 4: Update Environment Variables**

### **4.1 Vercel Frontend Environment**

1. Go to Vercel Dashboard → Project Settings → Environment Variables

2. Add/Update:
   ```
   VITE_API_URL=https://api.daansathi.com/api
   VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
   VITE_PLATFORM_FEE_PERCENTAGE=2
   ```

3. Redeploy: `git push` or manual redeploy in Vercel

### **4.2 Render Backend Environment**

1. Go to Render Dashboard → Service → Environment

2. Add/Update:
   ```
   # Production Database (use production MongoDB)
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/daansathi-prod
   
   # Razorpay Production
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=[secret-key]
   RAZORPAY_WEBHOOK_SECRET=[webhook-secret]
   
   # Email (for production)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=[app-specific-password]
   
   # Frontend URL
   FRONTEND_URL=https://daansathi.com
   
   # Security
   JWT_SECRET=[generate-secure-random-string]
   NODE_ENV=production
   PORT=10000
   ```

3. Redeploy and verify

---

## **STEP 5: Platform Fee Collection Logic**

### **5.1 Frontend Implementation**

Add platform fee calculation in checkout:

```javascript
// In CheckoutPage.jsx or payment component

const PLATFORM_FEE_PERCENTAGE = 2; // 2%

const calculateAmounts = (donationAmount) => {
  const platformFee = (donationAmount * PLATFORM_FEE_PERCENTAGE) / 100;
  const totalAmount = donationAmount + platformFee;
  return { donationAmount, platformFee, totalAmount };
};

// Show to user:
// Donation Amount: ₹100
// Platform Fee (2%): ₹2
// Total: ₹102
```

### **5.2 Backend Implementation**

Track platform fees in Payment model:

```javascript
// In server/models/Payment.js
{
  donationAmount: Number,      // ₹100
  platformFee: Number,         // ₹2
  totalAmount: Number,         // ₹102
  platformFeePercentage: Number, // 2%
  netForCharity: Number,       // After all fees
}
```

### **5.3 Track in Dashboard**

Backend should track:
- Total donations collected
- Platform fees earned
- Amounts transferred to charities
- Monthly/yearly reports

---

## **STEP 6: Email & Payment Receipts**

### **6.1 Gmail SMTP Setup**

1. **Enable 2-Factor Authentication:**
   - Go to Google Account
   - Security → 2-Step Verification

2. **Generate App Password:**
   - Google Account → Security
   - App passwords (only if 2FA enabled)
   - Select "Mail" and "Windows Computer"
   - Copy password

3. **Update `.env`:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=[16-character-app-password]
   ```

### **6.2 Receipt Email Template**

Update `server/config/email.js`:

```javascript
const emailTemplate = `
Dear {donorName},

Thank you for your generous donation!

Donation Amount: ₹{amount}
Platform Fee: ₹{platformFee}
Transaction ID: {transactionId}
Date: {date}

Campaign: {campaignTitle}

Your donation will help make a real difference.

Best regards,
DaanSathi Team
`;
```

### **6.3 Admin Notifications**

Send admin emails when:
- Donation received
- Payment failed
- Withdrawal requested

---

## **STEP 7: Admin Account & Configuration**

### **7.1 Create Production Admin**

1. **Update seed script:**

```bash
# Update server/config/seed.js with production admin:
{
  email: "your-email@daansathi.com",
  password: "strong-production-password",
  name: "Admin",
  role: "superadmin"
}
```

2. **Run seed in production:**
   - Via Render shell: `npm run seed`
   - Or create admin manually via admin panel

### **7.2 Configure Homepage**

1. Login to Admin Dashboard: `https://daansathi.com/admin/login`

2. Configure:
   - **Hero Section:** Add professional banners
   - **About Section:** Your organization info
   - **Testimonials:** Add verified donor testimonials
   - **App Download:** Add download links
   - **Contact Info:** Support email/phone

3. Create Test Campaigns:
   - At least 3-5 for homepage display
   - Set status to 'active'
   - Add compelling descriptions and images

---

## **STEP 8: End-to-End Testing**

### **8.1 Pre-Launch Checklist**

- [ ] Domain resolves correctly (daansathi.com & api.daansathi.com)
- [ ] HTTPS works (lock icon in browser)
- [ ] Homepage loads without errors
- [ ] Campaigns display correctly
- [ ] Admin panel accessible at /admin/login
- [ ] Admin can create/edit campaigns
- [ ] Categories display
- [ ] Dark mode toggles
- [ ] Responsive on mobile

### **8.2 Payment Testing**

1. **Use Razorpay Test Mode First:**
   - Switch to test keys temporarily
   - Use test cards: `4111 1111 1111 1111`
   - Verify flow works

2. **Test Cases:**
   - [ ] Donate campaign → Checkout → Payment
   - [ ] Receipt email received
   - [ ] Admin dashboard updates
   - [ ] Campaign raised amount increases
   - [ ] Multiple donations work
   - [ ] Failed payment handling

### **8.3 Security Testing**

- [ ] Admin login requires authentication
- [ ] JWT tokens working
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] XSS protection enabled
- [ ] MongoDB injection prevention

### **8.4 Performance Testing**

- [ ] Homepage loads < 3 seconds
- [ ] API responses < 500ms
- [ ] Images optimized and loading
- [ ] Mobile performance good

---

## **STEP 9: Monitoring & Analytics**

### **9.1 Set Up Monitoring**

1. **Vercel Analytics:**
   - Built-in (no setup needed)
   - Dashboard → Analytics

2. **Render Monitoring:**
   - Built-in logs and metrics
   - Dashboard → Logs

3. **Razorpay Dashboard:**
   - Track all transactions
   - Download reconciliation reports

### **9.2 Error Tracking**

Implement error logging:
```javascript
// Add Sentry or similar
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### **9.3 Key Metrics to Track**

- Total donations collected
- Average donation amount
- Number of donors
- Failed payment rate
- Platform fee revenue
- Campaign success rate

---

## **STEP 10: Go Live Checklist**

### **Pre-Launch (24 hours before)**

- [ ] All environment variables set
- [ ] Database backups configured
- [ ] Email service tested
- [ ] Payment gateway tested
- [ ] Admin account created and tested
- [ ] Campaigns created and approved
- [ ] Homepage content updated
- [ ] SSL certificates active
- [ ] Domain DNS propagated (can take 24h)

### **Launch Day**

- [ ] Monitor error logs closely
- [ ] Test live donation from different devices
- [ ] Check email receipts working
- [ ] Admin dashboard responsive
- [ ] Payment webhooks firing

### **Post-Launch (First Week)**

- [ ] Monitor Razorpay for declined payments
- [ ] Check email delivery
- [ ] Review analytics
- [ ] User feedback monitoring
- [ ] Performance monitoring

---

## **Important Production Settings**

### **Database**
- Use MongoDB Atlas (already using)
- Enable backups
- Set IP whitelist to allow Render

### **Backend Security**
```javascript
// server/server.js - Update CORS for production
app.use(cors({
  origin: ['https://daansathi.com', 'https://www.daansathi.com'],
  credentials: true,
}));
```

### **Rate Limiting**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Adjust for production
  message: 'Too many requests'
});
```

### **Payment Verification**
Always verify Razorpay signatures:
- Never trust client-side payment status
- Always verify against Razorpay API
- Store all payment details in database

---

## **Troubleshooting**

### **Campaigns Not Showing**
- Check database has campaigns with status 'active'
- Verify MONGODB_URI in backend
- Check API is returning data

### **Payment Fails**
- Verify Razorpay API keys are production (rzp_live_)
- Check webhook is configured
- Verify payment signature verification

### **Emails Not Sending**
- Check GMAIL credentials and app password
- Verify email service isn't blocked
- Check spam folder

### **Domain Not Resolving**
- DNS changes can take 24-48 hours
- Check GoDaddy DNS settings
- Verify records at: https://dnschecker.org

---

## **Going Live Timeline**

| Phase | Duration | Action |
|-------|----------|--------|
| DNS Setup | 24-48 hours | Configure domain DNS records |
| SSL Setup | Automatic | Vercel & Render auto-configure |
| Testing | 1-2 days | Full end-to-end testing |
| Launch | 1 day | Go live with monitoring |
| Stabilization | 1 week | Monitor and fix issues |

---

## **Support & Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **GoDaddy Support:** https://www.godaddy.com/help

---

## **Next Steps**

1. ✅ Read through this entire guide
2. ✅ Gather all required credentials (Razorpay production keys, domain access, etc.)
3. ✅ Follow each step in order
4. ✅ Test thoroughly before going live
5. ✅ Monitor closely after launch

**Questions?** Refer back to specific sections or consult the resource documentation.

Good luck launching DaanSathi! 🚀
