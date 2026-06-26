# Local Development Setup Guide

This guide will help you set up the donation website on your local machine for development.

## Prerequisites

Install the following on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local) OR **MongoDB Atlas** account - [Atlas Signup](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

## Step 1: Clone or Extract Project

```bash
cd Desktop/NGO
# Your project is already here
```

## Step 2: Backend Setup

### Install Dependencies

```bash
cd server
npm install
```

### Configure Environment Variables

Create `.env` file in the `server` folder:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Choose ONE option:

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/donation-db

# Option B: MongoDB Atlas (Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_characters
JWT_EXPIRE=30d

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary Configuration (Get from https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Seed Initial Data

This creates admin account, categories, and homepage:

```bash
npm run seed
```

You should see:
```
✅ Default admin created
   Email: admin@donation.com
   Password: admin123
✅ Category created: Old Age Homes
...
✅ Default homepage created
🎉 Database seeded successfully!
```

### Start Backend Server

```bash
npm run dev
```

Backend should start on `http://localhost:5000`

You should see:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: cluster.mongodb.net
```

## Step 3: Frontend Setup

Open a **new terminal** (keep backend running):

### Install Dependencies

```bash
cd client
npm install
```

### Configure Environment Variables

Create `.env` file in the `client` folder:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

### Start Frontend Server

```bash
npm run dev
```

Frontend should start on `http://localhost:5173`

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 4: Access the Application

### Public Website
Open browser: `http://localhost:5173`

### Admin Panel
1. Navigate to: `http://localhost:5173/admin/login`
2. Login with:
   - **Email**: admin@donation.com
   - **Password**: admin123
3. **Important**: Change password after first login!

## Step 5: Getting API Keys

### MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create a new cluster (Free M0 tier)
4. Create database user:
   - Database Access > Add New User
   - Username: `admin`
   - Password: (generate strong password)
5. Whitelist your IP:
   - Network Access > Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Clusters > Connect > Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `donation-db`

### Razorpay (Free Test Account)

1. Go to [Razorpay](https://dashboard.razorpay.com/)
2. Sign up
3. Complete KYC (for test mode, basic details enough)
4. Go to Settings > API Keys
5. Generate Test Keys
6. Copy:
   - Key ID: `rzp_test_xxxxx`
   - Key Secret: `xxxxx`

### Cloudinary (Free)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

### Gmail App Password

1. Go to your Google Account
2. Enable 2-Factor Authentication:
   - Security > 2-Step Verification > Get Started
3. Generate App Password:
   - Security > 2-Step Verification (scroll down)
   - App passwords
   - Select app: Mail
   - Select device: Other (enter "Donation Platform")
   - Generate
   - Copy 16-character password

## Step 6: Create Test Data

### Create Categories (Already done by seed script)

Categories are pre-created:
- Old Age Homes 👴
- Animal Welfare 🐾
- Dog Rescue 🐕
- Child Welfare 👶
- Education 📚
- Poor Families 🏠
- Medical Help 🏥
- Disaster Relief 🆘
- Food Distribution 🍲
- Environment 🌱

### Create Test Campaign

1. Login to admin panel
2. Go to Campaigns > Add Campaign
3. Fill in:
   - Title: "Help Build School for Underprivileged Children"
   - Short Description: "Support education for 100 children"
   - Description & Story: Write compelling content
   - Category: Select "Education"
   - Goal Amount: 100000
4. Upload images (use free stock photos from [Unsplash](https://unsplash.com/))
5. Save

### Test Donation Flow

1. Open public website: `http://localhost:5173`
2. Click on campaign
3. Click "Donate Now"
4. Fill donation form:
   - Amount: 500
   - Name: Test Donor
   - Email: test@example.com
5. Click "Proceed to Payment"
6. Razorpay test card details:
   - Card Number: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
   - Name: Any name
7. Complete payment
8. You should see success page
9. Check:
   - Email received (if configured)
   - Donation appears in Admin > Donations
   - Campaign raised amount updated

## Development Workflow

### Backend Development

1. Make changes in `server` folder
2. Server auto-restarts (nodemon)
3. Check terminal for errors
4. Test API with Thunder Client or Postman

### Frontend Development

1. Make changes in `client/src` folder
2. Browser auto-refreshes (Hot Module Replacement)
3. Check browser console for errors
4. Use React DevTools for debugging

### Database Management

**View Data:**
- Option 1: MongoDB Compass (GUI)
  - Download: [MongoDB Compass](https://www.mongodb.com/products/compass)
  - Connect with your MONGODB_URI
  
- Option 2: MongoDB Atlas Dashboard
  - Go to Collections
  - Browse data

**Reset Database:**
```bash
cd server
npm run seed
```

## Common Issues & Solutions

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Kill process using the port:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error

```
Error: MongooseError: connect ECONNREFUSED
```

**Solutions:**
1. Check MongoDB is running (if local)
2. Verify MONGODB_URI in `.env`
3. Check network access in MongoDB Atlas
4. Ensure correct password in connection string

### Razorpay Not Loading

**Solutions:**
1. Verify VITE_RAZORPAY_KEY_ID in client `.env`
2. Clear browser cache
3. Check browser console for errors
4. Ensure internet connection (Razorpay loads from CDN)

### Email Not Sending

**Solutions:**
1. Verify Gmail app password (not regular password)
2. Check 2FA is enabled
3. Verify EMAIL_USER and EMAIL_PASS in `.env`
4. Check spam folder

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Verify FRONTEND_URL in server `.env`
2. Check backend is running on port 5000
3. Restart backend server

## Useful Commands

### Backend
```bash
cd server
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database
```

### Frontend
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Development Tips

1. **Use Git**: Commit changes regularly
2. **Environment Variables**: Never commit `.env` files
3. **Testing**: Test on Chrome, Firefox, and Safari
4. **Mobile**: Test responsive design on mobile
5. **Security**: Use strong JWT secrets in production
6. **Backups**: Backup MongoDB regularly
7. **Logs**: Monitor server logs for errors
8. **Code Quality**: Use ESLint and Prettier

## VS Code Extensions (Recommended)

- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- GitLens

## Next Steps

1. ✅ Setup complete? Create more campaigns
2. ✅ Customize homepage content
3. ✅ Add testimonials
4. ✅ Test all features
5. ✅ Deploy to production (see DEPLOYMENT.md)

## Getting Help

If you encounter issues:
1. Check terminal/console for error messages
2. Review this guide
3. Check MongoDB connection
4. Verify all API keys are correct
5. Ensure all dependencies are installed

---

**Happy Coding!** 🚀

Your development environment is ready. Start building amazing features!
