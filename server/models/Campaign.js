import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide campaign title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide campaign description'],
    },
    shortDescription: {
        type: String,
        required: [true, 'Please provide short description'],
        maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    story: {
        type: String,
        required: [true, 'Please provide campaign story'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select a category'],
    },
    goalAmount: {
        type: Number,
        required: [true, 'Please provide goal amount'],
        min: [1, 'Goal amount must be at least 1'],
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
        caption: String,
    }],
    coverImage: {
        url: String,
        public_id: String,
    },
    organization: {
        name: String,
        contact: String,
        email: String,
        address: String,
    },
    updates: [{
        title: String,
        content: String,
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'draft', 'pending', 'rejected'],
        default: 'active',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    endDate: {
        type: Date,
    },
    donationCount: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    // For public campaign requests
    requestedBy: {
        name: String,
        email: String,
        phone: String,
    },
    rejectionReason: {
        type: String,
    },
    tags: [String],
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Generate slug before saving
campaignSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            + '-' + Date.now();
    }
    next();
});

// Virtual for remaining amount
campaignSchema.virtual('remainingAmount').get(function () {
    return Math.max(0, this.goalAmount - this.raisedAmount);
});

// Virtual for progress percentage
campaignSchema.virtual('progressPercentage').get(function () {
    return Math.min(100, Math.round((this.raisedAmount / this.goalAmount) * 100));
});

// Ensure virtuals are included in JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
