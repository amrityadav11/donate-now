# Deployment Guide - Donation Website

This guide will help you deploy your MERN donation website to production.

## Prerequisites

Before deploying, ensure you have:
- MongoDB Atlas account
- Razorpay account (with API keys)
- Cloudinary account
- Gmail account (for SMTP)
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier works for testing)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Save username and password
4. Whitelist IP addresses:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0`
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `donation-db`

## Step 2: Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up / Log in
3. Go to Settings > API Keys
4. Generate Test/Live API Keys
5. Save:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

## Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up / Log in
3. Go to Dashboard
4. Note down:
   - Cloud Name
   - API Key
   - API Secret

## Step 4: Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account > Security > 2-Step Verification
3. At bottom, click on "App passwords"
4. Select app: "Mail"
5. Select device: "Other" (enter "Donation Platform")
6. Click Generate
7. Copy the 16-character password (this is your EMAIL_PASS)

## Step 5: Backend Deployment (Render)

### Prepare Backend

1. Create `.env` file in server folder with production values:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secure_random_string_min_32_characters
JWT_EXPIRE=30d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" > "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: donation-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables (from your .env file)
7. Click "Create Web Service"
8. Wait for deployment to complete
9. Copy the deployed URL (e.g., `https://donation-backend.onrender.com`)

### Initialize Database

1. Once deployed, run the seed script:
   - Go to your Render service
   - Open "Shell" tab
   - Run: `npm run seed`
2. This creates:
   - Default admin account
   - Default categories
   - Default homepage content

## Step 6: Frontend Deployment (Vercel)

### Prepare Frontend

1. Update `client/.env.production`:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add Environment Variables:
   - `VITE_API_URL`
   - `VITE_RAZORPAY_KEY_ID`
6. Click "Deploy"
7. Wait for deployment
8. Copy the deployed URL (e.g., `https://your-donation-site.vercel.app`)

### Update Backend FRONTEND_URL

1. Go back to Render
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend service

## Step 7: Post-Deployment Configuration

### 1. Update Razorpay Webhook

1. Go to Razorpay Dashboard
2. Settings > Webhooks
3. Add webhook URL: `https://your-backend-url.onrender.com/api/payments/webhook`
4. Select events: `payment.captured`, `payment.failed`
5. Save webhook secret (if provided)

### 2. Test Admin Login

1. Visit: `https://your-frontend-url.vercel.app/admin/login`
2. Use default credentials:
   - Email: admin@donation.com
   - Password: admin123
3. **IMPORTANT**: Change password immediately after first login!

### 3. Configure Homepage

1. Log in to admin panel
2. Go to Homepage settings
3. Update:
   - Hero section
   - About section
   - Contact information
   - Social media links

### 4. Add Categories (Optional)

Categories are pre-seeded. You can add more:
1. Go to Admin > Categories
2. Click "Add Category"
3. Fill in details and save

### 5. Create Test Campaign

1. Go to Admin > Campaigns
2. Click "Add Campaign"
3. Fill in all details
4. Upload images
5. Publish campaign

### 6. Test Donation Flow

1. Visit a campaign on public site
2. Click "Donate Now"
3. Fill in donation details
4. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
5. Complete payment
6. Verify:
   - Payment success page
   - Email receipt (if email provided)
   - Campaign raised amount updated
   - Donation appears in admin panel

## Step 8: Domain Configuration (Optional)

### Custom Domain for Frontend (Vercel)

1. Go to Vercel project settings
2. Domains > Add Domain
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation

### Custom Domain for Backend (Render)

1. Go to Render service settings
2. Custom Domains > Add Custom Domain
3. Enter your domain
4. Update DNS records as instructed
5. Enable HTTPS

## Security Checklist

✅ Changed default admin password
✅ All environment variables are secure
✅ MongoDB network access is configured
✅ Razorpay keys are for correct mode (test/live)
✅ CORS is configured correctly
✅ Rate limiting is enabled
✅ Helmet security headers are active
✅ HTTPS is enabled
✅ Email credentials are app-specific

## Monitoring & Maintenance

### Monitor Backend (Render)

- Check logs regularly in Render dashboard
- Set up health check monitoring
- Monitor database usage in MongoDB Atlas

### Monitor Frontend (Vercel)

- Check deployment logs
- Monitor analytics
- Set up error tracking (Sentry recommended)

### Regular Tasks

1. **Daily**: Check new donations and contacts
2. **Weekly**: Review campaign performance
3. **Monthly**: 
   - Database backup
   - Update dependencies
   - Review security logs

## Troubleshooting

### Backend Issues

**Server won't start:**
- Check all environment variables are set
- Verify MongoDB connection string
- Check Render logs

**Payments failing:**
- Verify Razorpay keys
- Check webhook configuration
- Review payment logs

**Emails not sending:**
- Verify Gmail app password
- Check EMAIL_USER and EMAIL_PASS
- Ensure 2FA is enabled on Gmail

### Frontend Issues

**API calls failing:**
- Check VITE_API_URL is correct
- Verify CORS configuration
- Check network tab in browser

**Payment popup not opening:**
- Verify Razorpay script is loading
- Check VITE_RAZORPAY_KEY_ID
- Clear browser cache

## Support

For issues or questions:
- Check server logs in Render
- Review browser console for frontend errors
- Verify all environment variables
- Test with Razorpay test mode first

## Production Checklist

Before going live:

- [ ] All test transactions completed successfully
- [ ] Admin password changed from default
- [ ] Email notifications working
- [ ] All environment variables in production mode
- [ ] Razorpay in live mode (when ready)
- [ ] Homepage content updated
- [ ] At least 3-5 campaigns published
- [ ] Contact form tested
- [ ] Mobile responsiveness verified
- [ ] SSL certificates active
- [ ] Privacy policy and terms added
- [ ] Analytics configured (Google Analytics)
- [ ] Backup strategy in place

---

**Congratulations! Your donation platform is now live!** 🎉

For updates and improvements, always test in development environment first before deploying to production.
