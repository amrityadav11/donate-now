import mongoose from 'mongoose';

const itemCampaignSchema = new mongoose.Schema({
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
    // NGO details
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organization: {
        name: {
            type: String,
            required: true,
        },
        contact: String,
        email: String,
        address: String,
        registrationNumber: String,
    },
    // Required items for this campaign
    requiredItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantityNeeded: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
        },
        quantityDonated: {
            type: Number,
            default: 0,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
    }],
    // Beneficiary details
    beneficiaries: {
        count: {
            type: Number,
            required: true,
            min: [1, 'At least 1 beneficiary required'],
        },
        type: {
            type: String,
            enum: ['children', 'elderly', 'women', 'disabled', 'families', 'animals', 'community', 'other'],
            required: true,
        },
        description: String,
    },
    // Delivery information
    deliveryAddress: {
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: 'India',
        },
        coordinates: {
            latitude: Number,
            longitude: Number,
        },
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
    videos: [{
        url: String,
        title: String,
    }],
    documents: [{
        url: String,
        public_id: String,
        name: String,
        type: String,
    }],
    updates: [{
        title: String,
        content: String,
        images: [String],
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'paused', 'completed', 'rejected', 'cancelled'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    approvalDate: Date,
    rejectionReason: String,
    featured: {
        type: Boolean,
        default: false,
    },
    urgent: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
        required: true,
    },
    orderCount: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: [String],
}, {
    timestamps: true,
});

// Generate slug before saving
itemCampaignSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            + '-' + Date.now();
    }
    next();
});

// Virtual for overall progress percentage
itemCampaignSchema.virtual('progressPercentage').get(function () {
    if (!this.requiredItems || this.requiredItems.length === 0) return 0;

    const totalNeeded = this.requiredItems.reduce((sum, item) => sum + item.quantityNeeded, 0);
    const totalDonated = this.requiredItems.reduce((sum, item) => sum + item.quantityDonated, 0);

    return Math.min(100, Math.round((totalDonated / totalNeeded) * 100));
});

// Virtual for checking if campaign is completed
itemCampaignSchema.virtual('isCompleted').get(function () {
    if (!this.requiredItems || this.requiredItems.length === 0) return false;

    return this.requiredItems.every(item => item.quantityDonated >= item.quantityNeeded);
});

// Virtual for total value of campaign
itemCampaignSchema.virtual('totalValue').get(function () {
    return this.requiredItems.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantityNeeded;
    }, 0);
});

// Ensure virtuals are included in JSON
itemCampaignSchema.set('toJSON', { virtuals: true });
itemCampaignSchema.set('toObject', { virtuals: true });

// Indexes — slug unique already enforced in field definition
itemCampaignSchema.index({ status: 1 });
itemCampaignSchema.index({ ngo: 1 });
itemCampaignSchema.index({ deadline: 1 });
itemCampaignSchema.index({ featured: 1, status: 1 });

const ItemCampaign = mongoose.model('ItemCampaign', itemCampaignSchema);

export default ItemCampaign;
