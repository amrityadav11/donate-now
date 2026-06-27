import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Import routes
import adminRoutes from './routes/adminRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration — allow all origins in production for simplicity
app.use(cors({
  origin: true,   // reflects the request origin, effectively allowing all
  credentials: true,
}));

// Rate limiting — relax the limit for admin routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased to handle admin operations
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.path.startsWith('/admin'), // skip rate limiting for admin routes
});

app.use('/api/', limiter);

// Body parser middleware — 20mb to handle base64 image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
