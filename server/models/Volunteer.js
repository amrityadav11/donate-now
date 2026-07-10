import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    volunteerCode: {
        type: String,
        unique: true,
        required: true,
    },
    personalInfo: {
        dateOfBirth: Date,
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
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
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String,
        },
    },
    skills: [{
        type: String,
    }],
    interests: [{
        type: String,
        enum: [
            'education',
            'healthcare',
            'elderly_care',
            'child_welfare',
            'animal_welfare',
            'environment',
            'disaster_relief',
            'food_distribution',
            'skill_training',
            'awareness_campaigns',
            'other'
        ],
    }],
    availability: {
        days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        }],
        preferredShifts: [{
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'],
        }],
        hoursPerWeek: Number,
    },
    assignments: [{
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ItemCampaign',
        },
        task: {
            type: String,
            required: true,
        },
        description: String,
        assignedDate: {
            type: Date,
            default: Date.now,
        },
        deadline: Date,
        status: {
            type: String,
            enum: ['assigned', 'in_progress', 'completed', 'cancelled'],
            default: 'assigned',
        },
        completionDate: Date,
        photos: [String],
        notes: String,
        hoursWorked: {
            type: Number,
            default: 0,
        },
    }],
    stats: {
        totalAssignments: {
            type: Number,
            default: 0,
        },
        completedAssignments: {
            type: Number,
            default: 0,
        },
        totalHours: {
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
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'inactive', 'suspended'],
        default: 'pending',
    },
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['id_proof', 'address_proof', 'education', 'photo', 'other'],
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
    badges: [{
        name: String,
        icon: String,
        earnedDate: {
            type: Date,
            default: Date.now,
        },
    }],
    notes: String,
    lastActiveAt: Date,
}, {
    timestamps: true,
});

// Generate volunteer code before saving
volunteerSchema.pre('save', function (next) {
    if (!this.volunteerCode) {
        this.volunteerCode = `VOL${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100)}`;
    }
    next();
});

// Virtual for completion rate
volunteerSchema.virtual('completionRate').get(function () {
    if (this.stats.totalAssignments === 0) return 100;
    return Math.round((this.stats.completedAssignments / this.stats.totalAssignments) * 100);
});

// Ensure virtuals are included in JSON
volunteerSchema.set('toJSON', { virtuals: true });
volunteerSchema.set('toObject', { virtuals: true });

// Indexes
volunteerSchema.index({ volunteerCode: 1 });
volunteerSchema.index({ user: 1 });
volunteerSchema.index({ status: 1 });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
