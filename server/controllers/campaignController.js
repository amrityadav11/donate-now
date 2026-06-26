import Campaign from '../models/Campaign.js';
import Category from '../models/Category.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
    try {
        const { category, status, search, featured, sort, page = 1, limit = 12 } = req.query;

        // Build filter object
        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        else filter.status = 'active'; // Default to active campaigns for public
        if (featured !== undefined) filter.featured = featured === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Build sort object
        let sortOption = { createdAt: -1 };
        if (sort === 'popular') sortOption = { donationCount: -1 };
        if (sort === 'ending') sortOption = { endDate: 1 };
        if (sort === 'amount') sortOption = { raisedAmount: -1 };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const campaigns = await Campaign.find(filter)
            .populate('category', 'name slug icon')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Campaign.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: campaigns.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            campaigns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
export const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate('category', 'name slug icon')
            .populate('createdBy', 'name email');

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        // Increment views
        campaign.views += 1;
        await campaign.save();

        res.status(200).json({
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

// @desc    Get campaign by slug
// @route   GET /api/campaigns/slug/:slug
// @access  Public
export const getCampaignBySlug = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ slug: req.params.slug })
            .populate('category', 'name slug icon')
            .populate('createdBy', 'name email');

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        // Increment views
        campaign.views += 1;
        await campaign.save();

        res.status(200).json({
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

// @desc    Create campaign
// @route   POST /api/admin/campaigns
// @access  Private (Admin)
export const createCampaign = async (req, res) => {
    try {
        const {
            title,
            description,
            shortDescription,
            story,
            category,
            goalAmount,
            endDate,
            organization,
            tags,
            featured,
            images,
        } = req.body;

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const campaign = await Campaign.create({
            title,
            description,
            shortDescription,
            story,
            category,
            goalAmount,
            endDate,
            organization,
            tags,
            featured: featured || false,
            createdBy: req.admin._id,
            images: images || [],
            status: 'active',
        });

        // Update category campaign count
        categoryExists.campaignCount += 1;
        await categoryExists.save();

        res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update campaign
// @route   PUT /api/admin/campaigns/:id
// @access  Private (Admin)
export const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate('category', 'name slug icon');

        res.status(200).json({
            success: true,
            message: 'Campaign updated successfully',
            campaign: updatedCampaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/admin/campaigns/:id
// @access  Private (Admin)
export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        // Delete images from cloudinary
        if (campaign.images && campaign.images.length > 0) {
            for (const image of campaign.images) {
                if (image.public_id) {
                    await deleteFromCloudinary(image.public_id);
                }
            }
        }

        // Update category campaign count
        const category = await Category.findById(campaign.category);
        if (category) {
            category.campaignCount = Math.max(0, category.campaignCount - 1);
            await category.save();
        }

        await campaign.deleteOne();

        res.status(200).json({
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

// @desc    Upload campaign images
// @route   POST /api/admin/campaigns/:id/images
// @access  Private (Admin)
export const uploadCampaignImages = async (req, res) => {
    try {
        const { images } = req.body; // Array of base64 images

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide images',
            });
        }

        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        const uploadedImages = [];

        for (const image of images) {
            const result = await uploadToCloudinary(image, 'campaigns');
            uploadedImages.push({
                url: result.url,
                public_id: result.public_id,
            });
        }

        campaign.images.push(...uploadedImages);

        // Set first image as cover if not set
        if (!campaign.coverImage && uploadedImages.length > 0) {
            campaign.coverImage = uploadedImages[0];
        }

        await campaign.save();

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            images: uploadedImages,
            campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Submit public campaign request (pending approval)
// @route   POST /api/campaigns/request
// @access  Public
export const submitCampaignRequest = async (req, res) => {
    try {
        const {
            title, shortDescription, description, story,
            category, goalAmount, endDate, organization,
            requestedBy,
        } = req.body;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const campaign = await Campaign.create({
            title,
            shortDescription: shortDescription || title,
            description: description || story,
            story,
            category,
            goalAmount,
            endDate,
            organization,
            requestedBy,
            status: 'pending',
            featured: false,
        });

        res.status(201).json({
            success: true,
            message: 'Campaign request submitted successfully. Our team will review it shortly.',
            campaign: { id: campaign._id, title: campaign.title },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get pending campaign requests
// @route   GET /api/campaigns/requests
// @access  Private (Admin)
export const getCampaignRequests = async (req, res) => {
    try {
        const { status = 'pending', page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = { status };
        const campaigns = await Campaign.find(filter)
            .populate('category', 'name icon')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Campaign.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: campaigns.length,
            total,
            campaigns,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve a pending campaign
// @route   PUT /api/campaigns/:id/approve
// @access  Private (Admin)
export const approveCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

        if (campaign.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Campaign is not pending approval' });
        }

        campaign.status = 'active';
        campaign.createdBy = req.admin._id;
        await campaign.save();

        // Update category count
        await Category.findByIdAndUpdate(campaign.category, { $inc: { campaignCount: 1 } });

        res.status(200).json({
            success: true,
            message: 'Campaign approved and published successfully',
            campaign,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reject a pending campaign
// @route   PUT /api/campaigns/:id/reject
// @access  Private (Admin)
export const rejectCampaign = async (req, res) => {
    try {
        const { reason } = req.body;
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

        campaign.status = 'rejected';
        campaign.rejectionReason = reason || 'Does not meet our guidelines';
        await campaign.save();

        res.status(200).json({
            success: true,
            message: 'Campaign request rejected',
            campaign,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all campaigns (admin — all statuses)
// @route   GET /api/campaigns/admin/all
// @access  Private (Admin)
export const getAdminCampaigns = async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const filter = status ? { status } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const campaigns = await Campaign.find(filter)
            .populate('category', 'name slug icon')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Campaign.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: campaigns.length,
            total,
            campaigns,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @access  Private (Admin)
export const addCampaignUpdate = async (req, res) => {
    try {
        const { title, content } = req.body;

        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        campaign.updates.push({
            title,
            content,
            date: Date.now(),
        });

        await campaign.save();

        res.status(200).json({
            success: true,
            message: 'Update added successfully',
            campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
