import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
    jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '30d' });

const userResponse = (user, token) => ({
    success: true,
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        provider: user.provider,
        savedCampaigns: user.savedCampaigns,
    },
});

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });

        const user = await User.create({ name, email, password, phone });
        user.lastLogin = Date.now();
        await user.save();

        res.status(201).json(userResponse(user, generateToken(user._id)));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid email or password' });

        if (!user.isActive)
            return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json(userResponse(user, generateToken(user._id)));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedCampaigns', 'title slug coverImage raisedAmount goalAmount');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
export const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user._id);
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        await user.save();
        res.status(200).json({ success: true, message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private (User)
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.comparePassword(currentPassword)))
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Save / unsave a campaign
// @route   PUT /api/users/save-campaign/:id
// @access  Private (User)
export const toggleSaveCampaign = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const cid = req.params.id;
        const idx = user.savedCampaigns.indexOf(cid);
        if (idx === -1) {
            user.savedCampaigns.push(cid);
        } else {
            user.savedCampaigns.splice(idx, 1);
        }
        await user.save();
        res.status(200).json({
            success: true,
            saved: idx === -1,
            savedCampaigns: user.savedCampaigns,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
