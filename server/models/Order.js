import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: String,
    productImage: String,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCampaign',
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    donorInfo: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    couponCode: String,
    // Payment details
    payment: {
        method: {
            type: String,
            enum: ['razorpay', 'stripe', 'upi', 'card', 'netbanking', 'wallet'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        transactionId: String,
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        stripePaymentIntentId: String,
        paidAt: Date,
    },
    // Order status and tracking
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'packing', 'shipped', 'in_transit', 'delivered', 'cancelled', 'refunded'],
        default: 'pending',
    },
    timeline: [{
        status: {
            type: String,
            required: true,
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        location: String,
    }],
    // Delivery details
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    proofOfDelivery: {
        images: [String],
        signature: String,
        receivedBy: String,
        notes: String,
    },
    tracking: {
        currentLocation: {
            address: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },
        estimatedDelivery: Date,
        trackingNumber: String,
    },
    // Gift donation
    giftDonation: {
        isGift: {
            type: Boolean,
            default: false,
        },
        recipientName: String,
        recipientEmail: String,
        message: String,
        notified: {
            type: Boolean,
            default: false,
        },
    },
    // Certificate and receipt
    certificateGenerated: {
        type: Boolean,
        default: false,
    },
    certificateUrl: String,
    receiptUrl: String,
    receiptSent: {
        type: Boolean,
        default: false,
    },
    // Impact report
    impactReport: {
        generated: {
            type: Boolean,
            default: false,
        },
        url: String,
        sentAt: Date,
        photos: [String],
        description: String,
    },
    // Cancellation/Refund
    cancellation: {
        reason: String,
        requestedAt: Date,
        approvedAt: Date,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    refund: {
        amount: Number,
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
        },
        processedAt: Date,
        refundId: String,
    },
    notes: String,
    adminNotes: String,
}, {
    timestamps: true,
});

// Generate order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function (status, description, location) {
    this.timeline.push({
        status,
        description,
        location,
        timestamp: new Date(),
    });
    return this.save();
};

// Virtual for campaigns involved
orderSchema.virtual('campaignIds').get(function () {
    return [...new Set(this.items.map(item => item.campaign.toString()))];
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Indexes — orderNumber unique already enforced in field definition
orderSchema.index({ donor: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ deliveryPartner: 1 });
orderSchema.index({ 'items.campaign': 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
