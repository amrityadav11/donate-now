import ItemCampaign from '../models/ItemCampaign.js';
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Get all item campaigns
// @route   GET /api/item-campaigns
// @access  Public
export const getItemCampaigns = async (req, res) => {
    try {
        const { status = 'active', category, featured, urgent, sort, page = 1, limit = 12 } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (urgent === 'true') {
            query.urgent = true;
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'ending_soon') {
            sortOption = { deadline: 1 };
        } else if (sort === 'popular') {
            sortOption = { views: -1 };
        }

        const skip = (page - 1) * limit;

        const campaigns = await ItemCampaign.find(query)
            .populate('category')
            .populate('ngo', 'name email')
            .populate('requiredItems.product')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await ItemCampaign.countDocuments(query);

        res.json({
            success: true,
            campaigns,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single item campaign by ID
// @route   GET /api/item-campaigns/id/:id
// @access  Public
export const getItemCampaignById = async (req, res) => {
    try {
        const campaign = await ItemCampaign.findById(req.params.id)
            .populate('category', 'name icon')
            .populate('ngo', 'name email')
            .populate('requiredItems.product', 'name price coverImage images category');
        if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single item campaign
// @route   GET /api/item-campaigns/:slug
// @access  Public
export const getItemCampaignBySlug = async (req, res) => {
    try {
        const campaign = await ItemCampaign.findOne({ slug: req.params.slug })
            .populate('category')
            .populate('ngo', 'name email phone')
            .populate('requiredItems.product')
            .populate('approvedBy', 'name');

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        // Increment views
        campaign.views += 1;
        await campaign.save();

        res.json({
            success: true,
            campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create item campaign
// @route   POST /api/item-campaigns
// @access  Private/NGO
export const createItemCampaign = async (req, res) => {
    try {
        const campaign = await ItemCampaign.create({
            ...req.body,
            ngo: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Campaign created successfully. Waiting for admin approval.',
            campaign,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update item campaign
// @route   PUT /api/item-campaigns/:id
// @access  Private/NGO/Admin
export const updateItemCampaign = async (req, res) => {
    try {
        let campaign = await ItemCampaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        campaign = await ItemCampaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Campaign updated successfully',
            campaign,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Approve/Reject item campaign
// @route   PUT /api/item-campaigns/:id/review
// @access  Private/Admin
export const reviewItemCampaign = async (req, res) => {
    try {
        const { action, rejectionReason } = req.body;

        const campaign = await ItemCampaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        if (action === 'approve') {
            campaign.status = 'approved';
            campaign.approvedBy = req.user.id;
            campaign.approvalDate = new Date();
        } else if (action === 'reject') {
            campaign.status = 'rejected';
            campaign.rejectionReason = rejectionReason;
        }

        await campaign.save();

        res.json({
            success: true,
            message: `Campaign ${action}d successfully`,
            campaign,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete item campaign
// @route   DELETE /api/item-campaigns/:id
// @access  Private/NGO/Admin
export const deleteItemCampaign = async (req, res) => {
    try {
        const campaign = await ItemCampaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        // Delete images from cloudinary
        for (const image of campaign.images) {
            if (image.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await campaign.deleteOne();

        res.json({
            success: true,
            message: 'Campaign deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
