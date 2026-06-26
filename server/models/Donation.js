import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: [true, 'Campaign is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Donation amount is required'],
        min: [1, 'Amount must be at least 1'],
    },
    donorName: {
        type: String,
        trim: true,
    },
    donorEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    donorPhone: {
        type: String,
        trim: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
    },
    receiptSent: {
        type: Boolean,
        default: false,
    },
    ipAddress: {
        type: String,
    },
}, {
    timestamps: true,
});

// Index for faster queries
donationSchema.index({ campaign: 1, createdAt: -1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donorEmail: 1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
