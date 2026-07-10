import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCampaign',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
    donorInfo: {
        name: String,
        email: String,
        phone: String,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    giftDonation: {
        isGift: {
            type: Boolean,
            default: false,
        },
        recipientName: String,
        recipientEmail: String,
        message: String,
    },
    couponCode: String,
    discount: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
}, {
    timestamps: true,
});

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Virtual for total after discount
cartSchema.virtual('total').get(function () {
    return Math.max(0, this.subtotal - this.discount);
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

// Index for faster queries — sessionId unique already enforced in field definition
cartSchema.index({ user: 1 });
// TTL index for auto-delete expired carts
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
