# Donation Website - Full Stack MERN Application

A modern, production-ready donation platform where visitors can browse causes and donate instantly without registration.

## 🌟 Features

### Public Features
- **No Login Required**: Visitors can donate directly without creating accounts
- **Campaign Browsing**: Browse multiple donation categories and campaigns
- **Instant Donations**: Seamless payment through Razorpay
- **Anonymous Donations**: Option to donate anonymously
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Campaign Search**: Find campaigns by name or category
- **Social Sharing**: Share campaigns on social media

### Admin Features
- **Secure Dashboard**: JWT-based admin authentication
- **Campaign Management**: Create, edit, and delete campaigns
- **Category Management**: Organize campaigns by categories
- **Donation Analytics**: View donation statistics and reports
- **Homepage Management**: Update hero banners and testimonials
- **Image Management**: Upload campaign images via Cloudinary

## 🛠️ Technology Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Helmet (Security)
- Express Rate Limit

### Third-Party Services
- **Payment**: Razorpay
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Email**: Nodemailer (for receipts)

## 📁 Project Structure

```
donation-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Razorpay account
- Cloudinary account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:5173
```

4. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start frontend:
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 👨‍💼 Admin Access

### Default Admin Credentials
- **Email**: admin@donation.com
- **Password**: admin123

⚠️ **Important**: Change default admin credentials after first login!

### Admin Routes
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`

## 🎨 Design Features

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first approach
- **Dark Mode**: System-based or manual toggle
- **Loading States**: Skeleton screens for better UX
- **Toast Notifications**: User-friendly feedback
- **Optimized Images**: Lazy loading and WebP format

## 💳 Payment Integration

### Razorpay Setup
1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from dashboard
3. Add keys to environment variables
4. Test with test mode before going live

### Supported Payment Methods
- UPI
- QR Code
- Credit/Debit Cards
- Net Banking
- Wallets (Paytm, PhonePe, etc.)

## 📊 Database Collections

### Admin
- email
- password (hashed)
- name
- role
- createdAt

### Campaigns
- title
- description
- category
- goalAmount
- raisedAmount
- images
- status
- createdBy
- createdAt
- updatedAt

### Categories
- name
- description
- icon
- slug
- campaignCount

### Donations
- campaign
- amount
- donorName (optional)
- donorEmail (optional)
- donorPhone (optional)
- isAnonymous
- paymentId
- orderId
- status
- createdAt

### Payments
- orderId
- paymentId
- signature
- amount
- currency
- status
- method
- donationId
- createdAt

## 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet.js (HTTP headers)
- Rate Limiting
- Input Validation
- CORS Configuration
- XSS Protection
- MongoDB Injection Prevention
- Secure Payment Verification

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create Web Service in Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Add IP whitelist (0.0.0.0/0 for production)
3. Get connection string
4. Update environment variable

## 📧 Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate app password
3. Use in EMAIL_PASS variable

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 API Documentation

### Public Endpoints
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `GET /api/categories` - Get all categories
- `POST /api/donations` - Create donation
- `POST /api/payments/verify` - Verify payment

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard stats
- `POST /api/admin/campaigns` - Create campaign
- `PUT /api/admin/campaigns/:id` - Update campaign
- `DELETE /api/admin/campaigns/:id` - Delete campaign

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ by [Your Name]

## 📞 Support

For support, email support@donation.com

---

**Note**: This is a complete production-ready application. Make sure to update all environment variables before deployment.
