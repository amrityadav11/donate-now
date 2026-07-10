import mongoose from 'mongoose';

const corporateCSRSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyInfo: {
        name: {
            type: String,
            required: true,
        },
        registrationNumber: String,
        gstNumber: String,
        industry: String,
        size: {
            type: String,
            enum: ['small', 'medium', 'large', 'enterprise'],
        },
        website: String,
        logo: {
            url: String,
            public_id: String,
        },
    },
    contactPerson: {
        name: String,
        designation: String,
        email: String,
        phone: String,
    },
    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India',
        },
    },
    csrBudget: {
        annualBudget: Number,
        utilizedBudget: {
            type: Number,
            default: 0,
        },
        fiscalYear: String,
    },
    focusAreas: [{
        type: String,
        enum: [
            'education',
            'healthcare',
            'environment',
            'poverty_alleviation',
            'women_empowerment',
            'skill_development',
            'rural_development',
            'disaster_management',
            'sports',
            'arts_and_culture',
            'other'
        ],
    }],
    campaigns: [{
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ItemCampaign',
        },
        contributionType: {
            type: String,
            enum: ['items', 'money', 'both'],
        },
        amount: Number,
        itemsDonated: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        }],
        donationDate: {
            type: Date,
            default: Date.now,
        },
        certificateUrl: String,
    }],
    employeeMatching: {
        enabled: {
            type: Boolean,
            default: false,
        },
        matchingPercentage: {
            type: Number,
            default: 100,
        },
        maxMatchAmount: Number,
        totalMatched: {
            type: Number,
            default: 0,
        },
    },
    employeeDonations: [{
        employee: {
            name: String,
            email: String,
            employeeId: String,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        amount: Number,
        matchedAmount: Number,
        donationDate: {
            type: Date,
            default: Date.now,
        },
    }],
    documents: [{
        type: {
            type: String,
            enum: ['registration', 'gst', 'csr_policy', 'pan', 'authorization_letter', 'other'],
        },
        url: String,
        public_id: String,
        verified: {
            type: Boolean,
            default: false,
        },
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'suspended', 'inactive'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    approvalDate: Date,
    rejectionReason: String,
    stats: {
        totalContributions: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        campaignsSupported: {
            type: Number,
            default: 0,
        },
        employeeParticipation: {
            type: Number,
            default: 0,
        },
    },
    reports: [{
        month: String,
        year: Number,
        summary: String,
        amount: Number,
        campaigns: Number,
        employees: Number,
        generatedAt: {
            type: Date,
            default: Date.now,
        },
        reportUrl: String,
    }],
    notes: String,
}, {
    timestamps: true,
});

// Indexes
corporateCSRSchema.index({ user: 1 });
corporateCSRSchema.index({ 'companyInfo.name': 1 });
corporateCSRSchema.index({ status: 1 });

const CorporateCSR = mongoose.model('CorporateCSR', corporateCSRSchema);

export default CorporateCSR;
