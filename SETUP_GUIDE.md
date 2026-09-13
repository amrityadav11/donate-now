# DaanSathi - Complete Setup Guide

## Project Overview

DaanSathi is a full-stack MERN donation platform with **dual donation systems**:
1. **Cash-based donations** - Traditional fundraising campaigns
2. **Item-based donations** - DonateKart-style product donation system

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Razorpay for payments
- Nodemailer for emails

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router v6
- Axios
- Zustand (state management)
- Framer Motion (animations)
- React Hot Toast (notifications)
- React Icons

## Prerequisites

- Node.js v16+ installed
- MongoDB Atlas account
- Razorpay account
- Cloudinary account
- Gmail account (for SMTP)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd NGO

# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### 2. Backend Configuration

```bash
# Navigate to server
cd server

# Copy environment template
copy .env.example .env
```

Edit `server/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daansathi?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=30d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Configuration

```bash
# Navigate to client
cd client

# Copy environment template
copy .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 4. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates:
- Default admin account
- Sample categories
- Sample campaigns
- Homepage content

**Default Admin Credentials:**
- Email: admin@donation.com
- Password: admin123

⚠️ **IMPORTANT:** Change admin password after first login!

### 5. Start Development Servers

Option 1 - Run both servers concurrently (from root):
```bash
npm run dev
```

Option 2 - Run separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin/login

## Gmail SMTP Setup

1. Enable 2-Factor Authentication in your Google Account
2. Generate App Password:
   - Go to Google Account → Security
   - Select "2-Step Verification"
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get credentials from Dashboard
3. Add to `.env` file

## Razorpay Setup

1. Sign up at https://razorpay.com
2. Use Test Mode for development
3. Get API keys from Dashboard → Settings → API Keys
4. Add both Key ID and Key Secret to `.env` files

## MongoDB Atlas Setup

1. Create account at https://mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (Allow from anywhere)
5. Get connection string
6. Replace `<password>` with your database user password

## Project Structure

```
NGO/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── .env               # Frontend environment variables
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   ├── .env              # Backend environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
├── package.json          # Root package.json
├── README.md            # Project README
├── FEATURES.md          # Feature list
├── DEPLOYMENT.md        # Deployment guide
└── QUICKSTART.md        # Quick start guide
```

## Available Scripts

### Root Level
```bash
npm run install-all    # Install all dependencies
npm run dev           # Run both servers concurrently
npm run server        # Run backend only
npm run client        # Run frontend only
npm run build         # Build frontend for production
npm run seed          # Seed database
```

### Backend (server/)
```bash
npm start             # Start production server
npm run dev           # Start development server with nodemon
npm run seed          # Seed database with initial data
```

### Frontend (client/)
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
```

## API Endpoints

### Public Endpoints
```
GET    /api/campaigns                    # Get all cash campaigns
GET    /api/campaigns/:slug              # Get campaign details
GET    /api/categories                   # Get all categories
GET    /api/item-campaigns               # Get all item campaigns
GET    /api/item-campaigns/:slug         # Get item campaign details
GET    /api/products                     # Get all products
GET    /api/products/:id                 # Get product details
GET    /api/cart/:sessionId              # Get shopping cart
POST   /api/cart/add                     # Add item to cart
POST   /api/donations                    # Create donation
POST   /api/orders                       # Create order
POST   /api/contact                      # Send contact message
```

### Admin Endpoints (Protected)
```
POST   /api/admin/login                  # Admin login
GET    /api/admin/dashboard              # Dashboard stats
POST   /api/admin/campaigns              # Create campaign
PUT    /api/admin/campaigns/:id          # Update campaign
DELETE /api/admin/campaigns/:id          # Delete campaign
POST   /api/products                     # Create product
PUT    /api/products/:id                 # Update product
DELETE /api/products/:id                 # Delete product
PUT    /api/item-campaigns/:id/review    # Approve/Reject campaign
PUT    /api/orders/:id/status            # Update order status
```

## User Roles

1. **Guest** - Browse and donate without registration
2. **Donor** - Registered users with order history
3. **NGO** - Create and manage item campaigns
4. **Corporate** - CSR programs and employee matching
5. **Volunteer** - Task assignments and tracking
6. **Delivery Partner** - Order delivery management
7. **Admin** - Full platform management
8. **Super Admin** - System-level management

## Features Checklist

### ✅ Completed Features

**Cash Donation System:**
- Browse campaigns
- Category filtering
- Campaign details
- Direct donations (no login required)
- Razorpay payment integration
- Email receipts
- Admin campaign management

**Item Donation System:**
- Product catalog
- Item-based campaigns
- Shopping cart
- Order management
- Multiple payment methods
- Order tracking
- Admin approval workflow

**Authentication:**
- JWT authentication
- Email/password login
- Google OAuth (prepared)
- Password reset
- Role-based access control

**Admin Panel:**
- Dashboard with analytics
- Campaign management
- Category management
- Donation management
- Product management
- Order management
- Contact message management
- Homepage management

### 🔄 Pending Features (Optional)

- Delivery partner dashboard
- Volunteer management system
- Corporate CSR portal
- Impact report generation
- Certificate generation
- Advanced analytics
- Email campaigns
- SMS notifications
- Multi-language support

## Testing

### Test Razorpay Payment

Use these test cards in Test Mode:

**Card Number:** 4111 1111 1111 1111  
**CVV:** Any 3 digits  
**Expiry:** Any future date  
**OTP:** Any 6 digits

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Check if MongoDB URI is correct
- Verify database user password
- Check IP whitelist settings

**2. Razorpay Payment Fails**
- Verify both Key ID and Key Secret
- Ensure using Test Mode credentials
- Check frontend and backend have same Key ID

**3. Email Not Sending**
- Verify Gmail App Password
- Check SMTP settings
- Ensure 2FA is enabled on Gmail

**4. Images Not Uploading**
- Verify Cloudinary credentials
- Check API key and secret
- Ensure cloud name is correct

**5. CORS Errors**
- Check FRONTEND_URL in backend .env
- Verify API URL in frontend .env
- Ensure both servers are running

## Security Best Practices

1. **Never commit `.env` files**
2. **Change default admin password immediately**
3. **Use strong JWT secret (min 32 characters)**
4. **Enable HTTPS in production**
5. **Regularly update dependencies**
6. **Implement rate limiting (already configured)**
7. **Validate all inputs (already implemented)**
8. **Use environment variables for all secrets**

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions to:
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## Support

For issues or questions:
- Check existing documentation
- Review error logs
- Verify environment variables
- Check network connectivity

## License

MIT License

---

**Note:** This is a complete, production-ready application. Make sure to configure all environment variables before deploying to production.
