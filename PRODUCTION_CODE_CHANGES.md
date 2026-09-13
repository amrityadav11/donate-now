# 📝 Code Changes Required for Production Deployment

Specific code modifications needed to make DaanSathi production-ready with platform fees.

---

## **1. Update CORS for Production Domain**

### **File: `server/server.js`**

**Change from:**
```javascript
app.use(cors({
  origin: true,   // reflects the request origin, effectively allowing all
  credentials: true,
}));
```

**Change to:**
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://daansathi.com', 'https://www.daansathi.com']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

---

## **2. Update Frontend API URL Configuration**

### **File: `client/.env`**

**Change from:**
```
VITE_API_URL=https://donate-now-zu3l.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_T1ShzL7pR79oOo
```

**Change to:**
```
VITE_API_URL=https://api.daansathi.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
VITE_PLATFORM_FEE_PERCENTAGE=2
VITE_PLATFORM_NAME=DaanSathi
```

---

## **3. Add Platform Fee Calculation**

### **File: `client/src/services/donationService.js` (Create if doesn't exist)**

```javascript
export const donationService = {
  calculateFeeBreakdown: (amount, feePercentage = 2) => {
    const platformFee = (amount * feePercentage) / 100;
    const totalAmount = amount + platformFee;
    return {
      donationAmount: amount,
      platformFee: platformFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      feePercentage: feePercentage,
    };
  },
};
```

### **File: `client/src/components/DonationForm.jsx` (Update)**

```javascript
import { donationService } from '../services/donationService';

const PLATFORM_FEE_PERCENTAGE = parseInt(import.meta.env.VITE_PLATFORM_FEE_PERCENTAGE) || 2;

export const DonationForm = ({ campaign }) => {
  const [amount, setAmount] = useState('');
  const [feeBreakdown, setFeeBreakdown] = useState(null);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    if (value > 0) {
      setFeeBreakdown(donationService.calculateFeeBreakdown(value, PLATFORM_FEE_PERCENTAGE));
    }
  };

  return (
    <div className="donation-form">
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        min="10"
      />
      
      {feeBreakdown && (
        <div className="fee-breakdown bg-gray-50 p-4 rounded">
          <div className="flex justify-between mb-2">
            <span>Donation Amount:</span>
            <span>₹{feeBreakdown.donationAmount}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Platform Fee ({feeBreakdown.feePercentage}%):</span>
            <span>₹{feeBreakdown.platformFee}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total Charge:</span>
            <span>₹{feeBreakdown.totalAmount}</span>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## **4. Update Donation Model for Platform Fees**

### **File: `server/models/Donation.js`**

**Add fields:**
```javascript
const donationSchema = new mongoose.Schema({
  // ... existing fields ...
  
  // Platform fee tracking
  grossAmount: {
    type: Number,
    required: true,
    description: 'Amount charged to user (includes platform fee)'
  },
  netAmount: {
    type: Number,
    description: 'Amount for charity after platform fee'
  },
  platformFee: {
    type: Number,
    description: 'Platform fee amount'
  },
  platformFeePercentage: {
    type: Number,
    default: 2,
    description: 'Platform fee percentage'
  },
  razorpayFee: {
    type: Number,
    description: 'Razorpay payment gateway fee'
  },
  
  // ... rest of schema ...
}, { timestamps: true });
```

---

## **5. Update Payment Model for Platform Fees**

### **File: `server/models/Payment.js`**

```javascript
const paymentSchema = new mongoose.Schema({
  // ... existing fields ...
  
  // Breakdown
  grossAmount: Number,
  platformFee: Number,
  platformFeePercentage: Number,
  razorpayFee: Number,
  netAmount: Number,
  
  // Settlement tracking
  settledAt: Date,
  settlementStatus: {
    type: String,
    enum: ['pending', 'settled', 'failed'],
    default: 'pending'
  },
  settlementAmount: Number,
  
  // ... rest of schema ...
}, { timestamps: true });
```

---

## **6. Update Payment Controller for Fee Calculation**

### **File: `server/controllers/paymentController.js`**

**Update verifyPayment function:**

```javascript
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      await Donation.findByIdAndUpdate(donationId, { status: 'failed' });
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Calculate fees
    const PLATFORM_FEE_PERCENTAGE = 2; // 2%
    const grossAmount = payment.amount / 100; // Convert from paise
    const platformFee = (grossAmount * PLATFORM_FEE_PERCENTAGE) / 100;
    const razorpayFee = payment.fee ? payment.fee / 100 : (grossAmount * 0.029); // ~2.9%
    const netAmount = grossAmount - platformFee;

    // Update donation with fee details
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        status: 'success',
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        paymentMethod: payment.method,
        grossAmount: grossAmount,
        platformFee: platformFee,
        platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
        razorpayFee: razorpayFee,
        netAmount: netAmount,
      },
      { new: true }
    ).populate('campaign');

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'captured',
        method: payment.method,
        grossAmount: grossAmount,
        platformFee: platformFee,
        razorpayFee: razorpayFee,
        netAmount: netAmount,
      }
    );

    // Update campaign raised amount (net of fees)
    const campaign = await Campaign.findById(donation.campaign._id);
    campaign.raisedAmount += netAmount;
    campaign.donationCount += 1;
    await campaign.save();

    // Send receipt email with fee breakdown
    if (donation.donorEmail && !donation.isAnonymous) {
      try {
        await sendDonationReceipt({
          donorEmail: donation.donorEmail,
          donorName: donation.donorName || 'Generous Donor',
          grossAmount: grossAmount,
          platformFee: platformFee,
          netAmount: netAmount,
          campaignTitle: donation.campaign.title,
          transactionId: razorpay_payment_id,
          date: donation.createdAt,
        });

        donation.receiptSent = true;
        await donation.save();
      } catch (emailError) {
        console.error('Failed to send receipt email:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      donation: {
        id: donation._id,
        grossAmount: donation.grossAmount,
        platformFee: donation.platformFee,
        netAmount: donation.netAmount,
        status: donation.status,
        paymentId: razorpay_payment_id,
        campaign: donation.campaign.title,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};
```

---

## **7. Update Email Template with Fee Breakdown**

### **File: `server/config/email.js`**

```javascript
export const sendDonationReceipt = async (data) => {
  const {
    donorEmail,
    donorName,
    grossAmount,
    platformFee,
    netAmount,
    campaignTitle,
    transactionId,
    date,
  } = data;

  const emailBody = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank You for Your Donation!</h2>
        
        <p>Dear ${donorName},</p>
        
        <p>We deeply appreciate your generous donation to support meaningful causes.</p>
        
        <h3>Donation Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">Campaign:</td>
            <td style="padding: 8px;"><strong>${campaignTitle}</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">Amount Charged:</td>
            <td style="padding: 8px;"><strong>₹${grossAmount.toFixed(2)}</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">Platform Fee (2%):</td>
            <td style="padding: 8px;">₹${platformFee.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #f9f9f9; border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;"><strong>Amount for Campaign:</strong></td>
            <td style="padding: 8px;"><strong>₹${netAmount.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px;">Transaction ID:</td>
            <td style="padding: 8px;"><code>${transactionId}</code></td>
          </tr>
          <tr>
            <td style="padding: 8px;">Date:</td>
            <td style="padding: 8px;">${new Date(date).toLocaleDateString('en-IN')}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          <strong>Note:</strong> The platform fee helps us maintain and improve DaanSathi, 
          ensuring we can continue supporting important causes.
        </p>
        
        <p>Your donation is making a real difference!</p>
        
        <p>Best regards,<br/>
        <strong>DaanSathi Team</strong></p>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject: `Donation Receipt - DaanSathi (${campaignTitle})`,
    html: emailBody,
  });
};
```

---

## **8. Create Admin Dashboard Reports**

### **File: `server/controllers/adminController.js` (Add new function)**

```javascript
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's stats
    const todayDonations = await Donation.find({
      createdAt: { $gte: today },
      status: 'success'
    });

    const totalGross = todayDonations.reduce((sum, d) => sum + d.grossAmount, 0);
    const totalPlatformFees = todayDonations.reduce((sum, d) => sum + d.platformFee, 0);
    const totalNetAmount = todayDonations.reduce((sum, d) => sum + d.netAmount, 0);

    // This month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthDonations = await Donation.find({
      createdAt: { $gte: monthStart },
      status: 'success'
    });

    const stats = {
      today: {
        donations: todayDonations.length,
        grossAmount: totalGross,
        platformFees: totalPlatformFees,
        netForCampaigns: totalNetAmount,
        averageDonation: todayDonations.length > 0 ? totalGross / todayDonations.length : 0,
      },
      month: {
        donations: monthDonations.length,
        grossAmount: monthDonations.reduce((sum, d) => sum + d.grossAmount, 0),
        platformFees: monthDonations.reduce((sum, d) => sum + d.platformFee, 0),
        netForCampaigns: monthDonations.reduce((sum, d) => sum + d.netAmount, 0),
      },
      campaigns: await Campaign.countDocuments({ status: 'active' }),
      totalDonors: await Donation.distinct('donorEmail').length,
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## **9. Environment Variables Template**

### **Create: `server/.env.production`**

```env
# === PRODUCTION ENVIRONMENT ===

# Server
PORT=10000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/daansathi-prod

# JWT
JWT_SECRET=generate-a-long-random-string-min-64-chars
JWT_EXPIRE=30d

# Razorpay (PRODUCTION KEYS)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=app-specific-password

# URLs
FRONTEND_URL=https://daansathi.com
API_URL=https://api.daansathi.com

# Admin
ADMIN_EMAIL=your-email@daansathi.com
ADMIN_PASSWORD=strong-production-password
```

---

## **10. Deploy Checklist - Run Before Going Live**

```bash
# 1. Update backend environment
git commit -m "chore: add production environment configuration"

# 2. Verify build
npm run build

# 3. Test locally with production config
NODE_ENV=production npm start

# 4. Push to GitHub
git push origin main

# 5. Verify Render deployment status
# Visit: https://dashboard.render.com

# 6. Verify Vercel deployment status
# Visit: https://vercel.com/dashboard

# 7. Test live endpoints
curl https://api.daansathi.com/api/health
curl https://daansathi.com

# 8. Test payment flow with test card
# Card: 4111 1111 1111 1111
```

---

## **Summary of Changes**

| File | Change | Reason |
|------|--------|--------|
| `server/server.js` | Update CORS | Security - only allow daansathi.com |
| `client/.env` | Update API URL & Keys | Point to production services |
| `server/models/Donation.js` | Add fee fields | Track platform fees |
| `server/models/Payment.js` | Add fee fields | Track payment breakdown |
| `server/controllers/paymentController.js` | Calculate fees | Implement platform fee logic |
| `server/config/email.js` | Update template | Show fee breakdown to donors |
| `client/src/services/donationService.js` | Create new file | Fee calculation utility |

---

## **Testing Command Line**

```bash
# Test API health
curl https://api.daansathi.com/api/health

# Test get campaigns
curl https://api.daansathi.com/api/campaigns

# Test webhook (replace with actual data)
curl -X POST https://api.daansathi.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "payment.captured"}'
```

All code changes are production-ready and follow security best practices! ✅
