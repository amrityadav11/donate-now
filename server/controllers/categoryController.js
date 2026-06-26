import Category from '../models/Category.js';
import Campaign from '../models/Campaign.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const { isActive } = req.query;

        const filter = {};
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const categories = await Category.find(filter).sort({ order: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Get campaigns in this category
        const campaigns = await Campaign.find({
            category: category._id,
            status: 'active',
        }).limit(12);

        res.status(200).json({
            success: true,
            category,
            campaigns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
    try {
        const { name, description, icon, order } = req.body;

        // Check for duplicate name
        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }

        const category = await Category.create({
            name,
            description,
            icon,
            order,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        // Mongoose duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // If name is being changed, update slug too
        if (req.body.name && req.body.name !== category.name) {
            req.body.slug = req.body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has campaigns
        const campaignCount = await Campaign.countDocuments({ category: category._id });

        if (campaignCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with existing campaigns',
            });
        }

        // Delete image from cloudinary
        if (category.image && category.image.public_id) {
            await deleteFromCloudinary(category.image.public_id);
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Upload category image
// @route   POST /api/admin/categories/:id/image
// @access  Private (Admin)
export const uploadCategoryImage = async (req, res) => {
    try {
        const { image } = req.body; // base64 image

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an image',
            });
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Delete old image if exists
        if (category.image && category.image.public_id) {
            await deleteFromCloudinary(category.image.public_id);
        }

        // Upload new image
        const result = await uploadToCloudinary(image, 'categories');

        category.image = {
            url: result.url,
            public_id: result.public_id,
        };

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
