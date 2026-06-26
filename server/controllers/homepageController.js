import Homepage from '../models/Homepage.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import Category from '../models/Category.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get homepage data
// @route   GET /api/homepage
// @access  Public
export const getHomepage = async (req, res) => {
    try {
        let homepage = await Homepage.findOne();

        // Create default homepage if doesn't exist
        if (!homepage) {
            homepage = await Homepage.create({});
        }

        // Get real-time statistics
        const totalDonations = await Donation.countDocuments({ status: 'success' });
        const totalCampaigns = await Campaign.countDocuments({ status: 'active' });

        const amountResult = await Donation.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const amountRaised = amountResult.length > 0 ? amountResult[0].total : 0;

        // Get unique donor count
        const uniqueDonors = await Donation.distinct('donorEmail', {
            status: 'success',
            isAnonymous: false,
            donorEmail: { $ne: null },
        });

        // Update statistics
        homepage.statistics = {
            totalDonations,
            totalDonors: uniqueDonors.length,
            totalCampaigns,
            amountRaised,
        };

        await homepage.save();

        res.status(200).json({
            success: true,
            homepage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update hero section
// @route   PUT /api/homepage/hero
// @access  Private (Admin)
export const updateHero = async (req, res) => {
    try {
        let homepage = await Homepage.findOne();
        if (!homepage) homepage = await Homepage.create({});

        const { title, subtitle, ctaText, ctaLink } = req.body;

        if (title !== undefined) homepage.hero.title = title;
        if (subtitle !== undefined) homepage.hero.subtitle = subtitle;
        if (ctaText !== undefined) homepage.hero.ctaText = ctaText;
        if (ctaLink !== undefined) homepage.hero.ctaLink = ctaLink;

        homepage.markModified('hero');
        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Hero section updated successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload hero image
// @route   POST /api/admin/homepage/hero/image
// @access  Private (Admin)
export const uploadHeroImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an image',
            });
        }

        let homepage = await Homepage.findOne();

        if (!homepage) {
            homepage = await Homepage.create({});
        }

        // Delete old image if exists
        if (homepage.hero.backgroundImage?.public_id) {
            await deleteFromCloudinary(homepage.hero.backgroundImage.public_id);
        }

        // Upload new image
        const result = await uploadToCloudinary(image, 'homepage');

        homepage.hero.backgroundImage = {
            url: result.url,
            public_id: result.public_id,
        };

        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Hero image uploaded successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update about section
// @route   PUT /api/homepage/about
// @access  Private (Admin)
export const updateAbout = async (req, res) => {
    try {
        let homepage = await Homepage.findOne();
        if (!homepage) homepage = await Homepage.create({});

        const { title, content, image } = req.body;

        if (title !== undefined) homepage.about.title = title;
        if (content !== undefined) homepage.about.content = content;

        if (image && image.startsWith('data:')) {
            if (homepage.about.image?.public_id) {
                await deleteFromCloudinary(homepage.about.image.public_id);
            }
            const result = await uploadToCloudinary(image, 'homepage');
            homepage.about.image = { url: result.url, public_id: result.public_id };
        }

        homepage.markModified('about');
        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'About section updated successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add testimonial
// @route   POST /api/admin/homepage/testimonials
// @access  Private (Admin)
export const addTestimonial = async (req, res) => {
    try {
        let homepage = await Homepage.findOne();

        if (!homepage) {
            homepage = await Homepage.create({});
        }

        const { name, message, designation, rating } = req.body;

        homepage.testimonials.push({
            name,
            message,
            designation,
            rating: rating || 5,
            isActive: true,
        });

        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Testimonial added successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update testimonial
// @route   PUT /api/admin/homepage/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = async (req, res) => {
    try {
        const homepage = await Homepage.findOne();

        if (!homepage) {
            return res.status(404).json({
                success: false,
                message: 'Homepage not found',
            });
        }

        const testimonial = homepage.testimonials.id(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        Object.assign(testimonial, req.body);
        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/admin/homepage/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = async (req, res) => {
    try {
        const homepage = await Homepage.findOne();

        if (!homepage) {
            return res.status(404).json({
                success: false,
                message: 'Homepage not found',
            });
        }

        homepage.testimonials.pull(req.params.id);
        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update contact info
// @route   PUT /api/homepage/contact
// @access  Private (Admin)
export const updateContact = async (req, res) => {
    try {
        let homepage = await Homepage.findOne();
        if (!homepage) homepage = await Homepage.create({});

        // Deep merge contact fields
        const { email, phone, address, website, socialMedia } = req.body;
        if (email !== undefined) homepage.contact.email = email;
        if (phone !== undefined) homepage.contact.phone = phone;
        if (address !== undefined) homepage.contact.address = address;
        if (website !== undefined) homepage.contact.website = website;
        if (socialMedia) {
            homepage.contact.socialMedia = {
                ...homepage.contact.socialMedia,
                ...socialMedia,
            };
        }

        homepage.markModified('contact');
        await homepage.save();

        res.status(200).json({
            success: true,
            message: 'Contact information updated successfully',
            homepage,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
