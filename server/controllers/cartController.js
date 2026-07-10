import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ItemCampaign from '../models/ItemCampaign.js';

// @desc    Get cart
// @route   GET /api/cart/:sessionId
// @access  Public
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ sessionId: req.params.sessionId })
            .populate('items.product')
            .populate('items.campaign');

        if (!cart) {
            return res.json({
                success: true,
                cart: null,
            });
        }

        res.json({
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public
export const addToCart = async (req, res) => {
    try {
        const { sessionId, productId, campaignId, quantity = 1 } = req.body;

        // Validate product and campaign
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive',
            });
        }

        const campaign = await ItemCampaign.findById(campaignId);
        if (!campaign || campaign.status !== 'active') {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found or inactive',
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ sessionId });

        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                item.campaign.toString() === campaignId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                campaign: campaignId,
                quantity,
                price: product.price,
            });
        }

        await cart.save();
        await cart.populate('items.product items.campaign');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Public
export const updateCartItem = async (req, res) => {
    try {
        const { sessionId, productId, campaignId, quantity } = req.body;

        const cart = await Cart.findOne({ sessionId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                item.campaign.toString() === campaignId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
            });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product items.campaign');

        res.json({
            success: true,
            message: 'Cart updated',
            cart,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Public
export const removeFromCart = async (req, res) => {
    try {
        const { sessionId, productId, campaignId } = req.body;

        const cart = await Cart.findOne({ sessionId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        cart.items = cart.items.filter(
            item => !(item.product.toString() === productId &&
                item.campaign.toString() === campaignId)
        );

        await cart.save();
        await cart.populate('items.product items.campaign');

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/:sessionId
// @access  Public
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ sessionId: req.params.sessionId });

        res.json({
            success: true,
            message: 'Cart cleared',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
