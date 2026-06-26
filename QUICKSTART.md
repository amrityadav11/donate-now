# 🚀 Quick Start Guide

Get your donation website running in 5 minutes!

## Prerequisites

✅ Node.js installed (v16+)  
✅ Basic command line knowledge

## Step 1: Install Dependencies (2 min)

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies  
cd ../client
npm install
```

## Step 2: Setup Environment (1 min)

### Backend Configuration

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/donation-db
JWT_SECRET=your-secret-key-min-32-characters-long-please
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
```

## Step 3: Setup Database (1 min)

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin account (admin@donation.com / admin123)
- ✅ 10 donation categories
- ✅ Default homepage content

## Step 4: Start Servers (1 min)

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```
Wait for: `✅ MongoDB Connected`

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```
Wait for: `➜ Local: http://localhost:5173/`

## Step 5: Open & Test!

🌐 **Public Site:** http://localhost:5173  
🔐 **Admin Panel:** http://localhost:5173/admin/login

**Default Login:**
- Email: `admin@donation.com`
- Password: `admin123`

## Quick Test

1. ✅ Visit homepage
2. ✅ Browse campaigns
3. ✅ Login to admin
4. ✅ Create test campaign
5. ✅ Make test donation

## Using Test MongoDB Atlas (Recommended)

Instead of local MongoDB, use free cloud database:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create free cluster
4. Get connection string
5. Update `MONGODB_URI` in `server/.env`

## Getting API Keys (5 min)

### Razorpay (Required for payments)
1. https://dashboard.razorpay.com/
2. Sign up
3. Settings > API Keys > Generate Test Keys
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Cloudinary (Required for images)
1. https://cloudinary.com/
2. Sign up
3. Dashboard > Copy credentials
4. Update Cloudinary variables

## Test Payment

Use Razorpay test card:
- **Card:** 4111 1111 1111 1111
- **CVV:** 123
- **Expiry:** Any future date

## Troubleshooting

**MongoDB Error?**
→ Use MongoDB Atlas (free cloud database)

**Port 5000 in use?**
→ Change `PORT` in server/.env

**Razorpay not loading?**
→ Check `VITE_RAZORPAY_KEY_ID` in client/.env

## What's Next?

📖 Read full setup: [SETUP.md](SETUP.md)  
🚀 Deploy to production: [DEPLOYMENT.md](DEPLOYMENT.md)  
📝 View all features: [README.md](README.md)

---

**That's it! You're ready to go!** 🎉

Need help? Check the full documentation or create an issue.
