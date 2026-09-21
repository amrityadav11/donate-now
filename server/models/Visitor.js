import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: 'Unknown',
        },
        city: {
            type: String,
            default: 'Unknown',
        },
        visitedAt: {
            type: Date,
            default: Date.now,
        },
        lastActiveAt: {
            type: Date,
            default: Date.now,
        },
        isOnline: {
            type: Boolean,
            default: true,
        },
        pageViews: {
            type: Number,
            default: 1,
        },
        duration: {
            type: Number,
            default: 0, // in seconds
        },
    },
    { timestamps: true }
);

// Index for finding online visitors (within last 5 minutes)
visitorSchema.index({ lastActiveAt: 1 });
visitorSchema.index({ isOnline: 1 });
visitorSchema.index({ createdAt: 1 });

// Method to mark visitor as offline (no activity for 5 minutes)
visitorSchema.statics.markOfflineVisitors = async function () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await this.updateMany(
        { lastActiveAt: { $lt: fiveMinutesAgo }, isOnline: true },
        { isOnline: false }
    );
};

// Method to get total visitors
visitorSchema.statics.getTotalVisitors = async function () {
    return await this.countDocuments();
};

// Method to get online visitors
visitorSchema.statics.getOnlineVisitors = async function () {
    await this.markOfflineVisitors();
    return await this.countDocuments({ isOnline: true });
};

// Method to get today's visitors
visitorSchema.statics.getTodayVisitors = async function () {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await this.countDocuments({ visitedAt: { $gte: startOfDay } });
};

// Method to update visitor activity
visitorSchema.statics.updateVisitorActivity = async function (sessionId) {
    return await this.findByIdAndUpdate(
        sessionId,
        {
            lastActiveAt: new Date(),
            isOnline: true,
            $inc: { pageViews: 1 },
        },
        { new: true }
    );
};

export default mongoose.model('Visitor', visitorSchema);
