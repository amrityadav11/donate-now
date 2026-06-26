import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
        default: 'created',
    },
    method: {
        type: String,
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    razorpayOrderId: {
        type: String,
    },
    errorCode: {
        type: String,
    },
    errorDescription: {
        type: String,
    },
    refundId: {
        type: String,
    },
    refundAmount: {
        type: Number,
    },
    refundStatus: {
        type: String,
    },
    notes: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
});

// Index for faster queries
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ campaign: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
