import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ItemCampaign from '../models/ItemCampaign.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
    try {
        const { sessionId, donorInfo, isAnonymous, giftDonation } = req.body;

        const cart = await Cart.findOne({ sessionId })
            .populate('items.product')
            .populate('items.campaign');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty',
            });
        }

        // Create order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            productName: item.product.name,
            productImage: item.product.coverImage?.url || item.product.images[0]?.url,
            quantity: item.quantity,
            price: item.price,
            campaign: item.campaign._id,
        }));

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: cart.total * 100, // Convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        // Create order
        const order = await Order.create({
            donor: req.user?.id,
            donorInfo,
            isAnonymous,
            items: orderItems,
            subtotal: cart.subtotal,
            discount: cart.discount,
            total: cart.total,
            couponCode: cart.couponCode,
            payment: {
                method: 'razorpay',
                razorpayOrderId: razorpayOrder.id,
            },
            giftDonation,
        });

        res.status(201).json({
            success: true,
            order,
            razorpayOrderId: razorpayOrder.id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Verify payment
// @route   POST /api/orders/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

        const sign = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpaySignature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Update order
        const order = await Order.findById(orderId);
        order.payment.status = 'completed';
        order.payment.razorpayPaymentId = razorpayPaymentId;
        order.payment.razorpaySignature = razorpaySignature;
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        order.timeline.push({
            status: 'confirmed',
            description: 'Order confirmed and payment received',
        });

        await order.save();

        // Update campaign quantities
        for (const item of order.items) {
            const campaign = await ItemCampaign.findById(item.campaign);
            const requiredItem = campaign.requiredItems.find(
                ri => ri.product.toString() === item.product.toString()
            );
            if (requiredItem) {
                requiredItem.quantityDonated += item.quantity;
                campaign.orderCount += 1;
                await campaign.save();
            }
        }

        // Clear cart
        await Cart.findOneAndDelete({ sessionId: req.body.sessionId });

        res.json({
            success: true,
            message: 'Payment verified successfully',
            order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('items.campaign')
            .populate('deliveryPartner', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ donor: req.params.userId })
            .populate('items.product')
            .populate('items.campaign')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, description, location } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;
        order.timeline.push({
            status,
            description,
            location,
        });

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated',
            order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const query = {};
        if (status && status !== 'all') query.status = status;
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'donorInfo.name': { $regex: search, $options: 'i' } },
                { 'donorInfo.email': { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const orders = await Order.find(query)
            .populate('items.product', 'name coverImage')
            .populate('items.campaign', 'title')
            .populate('donor', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        const total = await Order.countDocuments(query);
        res.json({
            success: true,
            orders,
            pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/User
export const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
        }
        order.status = 'cancelled';
        order.cancellation = { reason, requestedAt: new Date() };
        order.timeline.push({ status: 'cancelled', description: reason || 'Cancelled by user' });
        await order.save();
        res.json({ success: true, message: 'Order cancelled', order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
