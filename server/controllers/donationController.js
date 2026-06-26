import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Payment from '../models/Payment.js';

// @desc    Get all donations (admin)
// @route   GET /api/admin/donations
// @access  Private
export const getAllDonations = async (req, res) => {
    try {
        const { status, campaign, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (campaign) filter.campaign = campaign;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const donations = await Donation.find(filter)
            .populate('campaign', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Donation.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: donations.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            donations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get donations for a campaign
// @route   GET /api/campaigns/:id/donations
// @access  Public
export const getCampaignDonations = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const donations = await Donation.find({
            campaign: req.params.id,
            status: 'success',
        })
            .select('amount donorName message createdAt isAnonymous')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Donation.countDocuments({
            campaign: req.params.id,
            status: 'success',
        });

        // Hide donor details for anonymous donations
        const sanitizedDonations = donations.map((donation) => ({
            ...donation.toObject(),
            donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Anonymous',
        }));

        res.status(200).json({
            success: true,
            count: sanitizedDonations.length,
            total,
            donations: sanitizedDonations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create donation
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req, res) => {
    try {
        const {
            campaignId,
            amount,
            donorName,
            donorEmail,
            donorPhone,
            isAnonymous,
            message,
        } = req.body;

        // Check if campaign exists
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
            });
        }

        if (campaign.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This campaign is not accepting donations',
            });
        }

        // Create donation with pending status
        const donation = await Donation.create({
            campaign: campaignId,
            amount,
            donorName: isAnonymous ? null : donorName,
            donorEmail: isAnonymous ? null : donorEmail,
            donorPhone: isAnonymous ? null : donorPhone,
            isAnonymous,
            message,
            status: 'pending',
            orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ipAddress: req.ip,
        });

        res.status(201).json({
            success: true,
            message: 'Donation initiated successfully',
            donation: {
                id: donation._id,
                orderId: donation.orderId,
                amount: donation.amount,
                campaign: campaign.title,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Public
export const getDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate(
            'campaign',
            'title'
        );

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found',
            });
        }

        res.status(200).json({
            success: true,
            donation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get donation receipt
// @route   GET /api/donations/:id/receipt
// @access  Public
export const getDonationReceipt = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate(
            'campaign',
            'title organization'
        );

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found',
            });
        }

        if (donation.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Receipt not available for this donation',
            });
        }

        const receipt = {
            receiptNumber: `RCPT-${donation._id}`,
            transactionId: donation.paymentId,
            orderId: donation.orderId,
            donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
            amount: donation.amount,
            date: donation.createdAt,
            campaign: donation.campaign.title,
            organization: donation.campaign.organization,
            status: donation.status,
        };

        res.status(200).json({
            success: true,
            receipt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
