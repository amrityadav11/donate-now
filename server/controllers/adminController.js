import Admin from '../models/Admin.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import Category from '../models/Category.js';
import generateToken from '../utils/generateToken.js';

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isPasswordMatch = await admin.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        res.status(200).json({
            success: true,
            admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const admin = await Admin.findById(req.admin._id);

        if (name) admin.name = name;
        if (email) admin.email = email;

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin._id).select('+password');

        // Check current password
        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create new admin
// @route   POST /api/admin/create
// @access  Private/Superadmin
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'An admin with this email already exists',
            });
        }

        const admin = await Admin.create({ name, email, password, role: role || 'admin' });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all admins
// @route   GET /api/admin/all
// @access  Private/Superadmin
export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            admins,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Toggle admin active status
// @route   PUT /api/admin/:id/toggle-status
// @access  Private/Superadmin
export const toggleAdminStatus = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }

        // Prevent deactivating yourself
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account',
            });
        }

        admin.isActive = !admin.isActive;
        await admin.save();

        res.status(200).json({
            success: true,
            message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
            admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }

        // Prevent deleting yourself
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        await admin.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
    try {
        // Get total campaigns
        const totalCampaigns = await Campaign.countDocuments();
        const activeCampaigns = await Campaign.countDocuments({ status: 'active' });

        // Get total donations
        const totalDonations = await Donation.countDocuments({ status: 'success' });

        // Get total amount raised
        const amountResult = await Donation.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalAmount = amountResult.length > 0 ? amountResult[0].total : 0;

        // Get recent donations
        const recentDonations = await Donation.find({ status: 'success' })
            .populate('campaign', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get category statistics
        const categories = await Category.find();

        // Get monthly donation data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Donation.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Get top campaigns
        const topCampaigns = await Campaign.find({ status: 'active' })
            .sort({ raisedAmount: -1 })
            .limit(5)
            .populate('category', 'name');

        res.status(200).json({
            success: true,
            statistics: {
                totalCampaigns,
                activeCampaigns,
                totalDonations,
                totalAmount,
            },
            recentDonations,
            categories,
            monthlyData,
            topCampaigns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
