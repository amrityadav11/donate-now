import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    // Partner details
    partnerCode: {
        type: String,
        unique: true,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['bike', 'scooter', 'car', 'van', 'truck', 'bicycle', 'walk'],
        required: true,
    },
    vehicleNumber: String,
    drivingLicense: {
        number: String,
        expiryDate: Date,
        verified: {
            type: Boolean,
            default: false,
        },
    },
    // Location and availability
    serviceAreas: [{
        city: String,
        pincodes: [String],
    }],
    currentLocation: {
        address: String,
        coordinates: {
            latitude: Number,
            longitude: Number,
        },
        lastUpdated: Date,
    },
    availability: {
        isAvailable: {
            type: Boolean,
            default: true,
        },
        schedule: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            },
            startTime: String,
            endTime: String,
            isActive: {
                type: Boolean,
                default: true,
            },
        }],
    },
    // Performance metrics
    stats: {
        totalDeliveries: {
            type: Number,
            default: 0,
        },
        completedDeliveries: {
            type: Number,
            default: 0,
        },
        cancelledDeliveries: {
            type: Number,
            default: 0,
        },
        activeDeliveries: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 5,
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        onTimeDeliveryRate: {
            type: Number,
            default: 100,
        },
    },
    // Verification and status
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'suspended', 'inactive'],
        default: 'pending',
    },
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['id_proof', 'address_proof', 'vehicle_registration', 'driving_license', 'photo', 'other'],
        },
        url: String,
        public_id: String,
        verified: {
            type: Boolean,
            default: false,
        },
    }],
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    approvalDate: Date,
    rejectionReason: String,
    // Bank details for payments (if applicable)
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String,
        bankName: String,
    },
    notes: String,
    lastActiveAt: Date,
}, {
    timestamps: true,
});

// Generate partner code before saving
deliveryPartnerSchema.pre('save', function (next) {
    if (!this.partnerCode) {
        this.partnerCode = `DP${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100)}`;
    }
    next();
});

// Method to update location
deliveryPartnerSchema.methods.updateLocation = function (latitude, longitude, address) {
    this.currentLocation = {
        coordinates: { latitude, longitude },
        address,
        lastUpdated: new Date(),
    };
    this.lastActiveAt = new Date();
    return this.save();
};

// Virtual for success rate
deliveryPartnerSchema.virtual('successRate').get(function () {
    if (this.stats.totalDeliveries === 0) return 100;
    return Math.round((this.stats.completedDeliveries / this.stats.totalDeliveries) * 100);
});

// Ensure virtuals are included in JSON
deliveryPartnerSchema.set('toJSON', { virtuals: true });
deliveryPartnerSchema.set('toObject', { virtuals: true });

// Indexes
deliveryPartnerSchema.index({ partnerCode: 1 });
deliveryPartnerSchema.index({ user: 1 });
deliveryPartnerSchema.index({ status: 1 });
deliveryPartnerSchema.index({ 'availability.isAvailable': 1, status: 1 });

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

export default DeliveryPartner;
