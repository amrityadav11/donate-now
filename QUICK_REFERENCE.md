# Quick Reference Card

## 🚀 Start Development

```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev

# Or start separately
npm run server  # Backend on :5000
npm run client  # Frontend on :5173
```

## 📁 Key Files

### Backend
```
server/
├── models/
│   ├── Product.js              # Product catalog
│   ├── ItemCampaign.js         # Item campaigns
│   ├── Cart.js                 # Shopping cart
│   └── Order.js                # Order management
├── controllers/
│   ├── productController.js    # Product CRUD
│   ├── itemCampaignController.js
│   ├── cartController.js
│   └── orderController.js
└── routes/
    ├── productRoutes.js
    ├── itemCampaignRoutes.js
    ├── cartRoutes.js
    └── orderRoutes.js
```

### Frontend
```
client/src/
├── services/
│   ├── productService.js       # Product APIs
│   ├── itemCampaignService.js  # Campaign APIs
│   ├── cartService.js          # Cart APIs
│   └── orderService.js         # Order APIs
├── components/
│   ├── ProductCard.jsx         # ✅ Created
│   ├── ShoppingCart.jsx        # ✅ Created
│   └── ItemCampaignCard.jsx    # ✅ Created
└── pages/
    ├── ItemCampaignsPage.jsx   # ✅ Created
    ├── ItemCampaignDetailPage.jsx # ✅ Created
    ├── CheckoutPage.jsx        # 🔲 TODO
    └── OrderConfirmationPage.jsx # 🔲 TODO
```

## 🔌 API Endpoints

### Products
```
GET    /api/products              # List all
GET    /api/products/:id          # Get one
POST   /api/products              # Create (Admin)
PUT    /api/products/:id          # Update (Admin)
DELETE /api/products/:id          # Delete (Admin)
GET    /api/products/categories/list # Categories
```

### Item Campaigns
```
GET    /api/item-campaigns        # List all
GET    /api/item-campaigns/:slug  # Get one
POST   /api/item-campaigns        # Create (NGO)
PUT    /api/item-campaigns/:id    # Update
PUT    /api/item-campaigns/:id/review # Approve (Admin)
DELETE /api/item-campaigns/:id    # Delete
```

### Cart
```
GET    /api/cart/:sessionId       # Get cart
POST   /api/cart/add              # Add item
PUT    /api/cart/update           # Update quantity
DELETE /api/cart/remove           # Remove item
DELETE /api/cart/:sessionId       # Clear cart
```

### Orders
```
POST   /api/orders                # Create order
POST   /api/orders/verify-payment # Verify payment
GET    /api/orders/:id            # Get order
GET    /api/orders/user/:userId   # User orders
PUT    /api/orders/:id/status     # Update status (Admin)
```

## 🎨 Component Patterns

### Page Structure
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const MyPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await myService.getData();
            setData(response.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <SEO title="Page Title" description="Description" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Content */}
                </div>
            </div>
        </>
    );
};

export default MyPage;
```

### Service Pattern
```javascript
import api from './api';

const myService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/endpoint', { params });
        return data;
    },
    
    getById: async (id) => {
        const { data } = await api.get(`/endpoint/${id}`);
        return data;
    },
    
    create: async (payload) => {
        const { data } = await api.post('/endpoint', payload);
        return data;
    },
    
    update: async (id, payload) => {
        const { data } = await api.put(`/endpoint/${id}`, payload);
        return data;
    },
    
    delete: async (id) => {
        const { data } = await api.delete(`/endpoint/${id}`);
        return data;
    },
};

export default myService;
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

## 🧪 Testing

### Test Razorpay Payment
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
OTP: Any 6 digits
```

### Test API with cURL
```bash
# Get products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_123",
    "productId": "product_id_here",
    "campaignId": "campaign_id_here",
    "quantity": 2
  }'
```

## 👥 User Roles

```
guest            → Browse & donate
donor            → Order history
ngo              → Create campaigns
corporate        → CSR programs
volunteer        → Task assignments
delivery_partner → Delivery management
admin            → Platform management
super_admin      → System management
```

## 📦 Product Categories

```javascript
[
  'Food Kit',
  'School Kit',
  'Blanket',
  'Medical Kit',
  'Wheelchair',
  'Books',
  'Shoes',
  'Sanitary Pads',
  'Baby Care Kit',
  'Water Filter',
  'Clothes',
  'Medicines',
  'Other'
]
```

## 🔄 Order Statuses

```javascript
'pending'      → Payment pending
'confirmed'    → Payment received
'packing'      → Items being prepared
'shipped'      → Out for delivery
'in_transit'   → On the way
'delivered'    → Successfully delivered
'cancelled'    → Order cancelled
'refunded'     → Payment refunded
```

## 🎯 Next TODOs

### Critical (Week 1)
1. [ ] Create CheckoutPage.jsx
2. [ ] Create OrderConfirmationPage.jsx
3. [ ] Update Navbar with cart icon
4. [ ] Test payment flow

### Important (Week 2)
5. [ ] Create MyOrdersPage.jsx
6. [ ] Create TrackOrderPage.jsx
7. [ ] Create ProductCatalogPage.jsx

### Admin (Week 3)
8. [ ] AdminProducts.jsx
9. [ ] AdminProductForm.jsx
10. [ ] AdminItemCampaigns.jsx
11. [ ] AdminOrders.jsx

## 📚 Documentation

```
README.md                   → Project overview
SETUP_GUIDE.md             → Setup instructions
ITEM_DONATION_FEATURES.md  → Feature documentation
PROJECT_SUMMARY.md         → High-level summary
IMPLEMENTATION_STATUS.md   → Progress tracker
FINAL_SUMMARY.md          → Comprehensive overview
QUICK_REFERENCE.md        → This file
```

## 🆘 Troubleshooting

### MongoDB Connection Error
```bash
# Check URI in .env
# Verify IP whitelist (0.0.0.0/0)
# Check database user password
```

### Payment Fails
```bash
# Verify Razorpay keys match
# Check Test Mode is enabled
# Verify frontend and backend have same Key ID
```

### CORS Error
```bash
# Check FRONTEND_URL in backend .env
# Verify API_URL in frontend .env
# Ensure both servers are running
```

## 🎨 Tailwind Classes

### Common Patterns
```css
/* Container */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

/* Card */
bg-white dark:bg-gray-800 rounded-lg shadow-md p-6

/* Button Primary */
bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700

/* Button Secondary */
bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg

/* Input */
px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700
```

## 🔗 Useful Commands

```bash
# Install dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Build for production
npm run build

# Preview production build
npm run preview

# Seed database
cd server && npm run seed

# Check for updates
npm outdated
```

## 📞 Quick Links

- MongoDB Atlas: https://mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com
- Razorpay Dashboard: https://dashboard.razorpay.com
- Vercel: https://vercel.com
- Render: https://render.com

---

**Keep this file handy for quick reference during development!**
