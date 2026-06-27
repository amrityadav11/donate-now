import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        url: String,
        public_id: String,
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    googleId: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: Date,
    savedCampaigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
    }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
