import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, featured, sort, page = 1, limit = 20 } = req.query;

        // Build query
        const query = { isActive: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (featured === 'true') {
            query.featured = true;
        }

        // Build sort
        let sortOption = { createdAt: -1 };
        if (sort === 'price_low') sortOption = { price: 1 };
        else if (sort === 'price_high') sortOption = { price: -1 };
        else if (sort === 'popular') sortOption = { totalOrdered: -1 };
        else if (sort === 'name') sortOption = { name: 1 };

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Delete images from cloudinary
        for (const image of product.images) {
            if (image.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Public
export const getProductCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');

        res.json({
            success: true,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
