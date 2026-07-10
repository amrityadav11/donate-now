import express from 'express';
import {
    createOrder,
    verifyPayment,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { protectUser } from '../middleware/userAuth.js';

const router = express.Router();

// ── Static routes FIRST (before :id) ──────────────────────────────────────
// Admin — list all orders
router.get('/admin/all', protect, getAllOrders);

// Public — create order & verify payment (guest donors)
router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);

// User — own orders
router.get('/user/:userId', protectUser, getUserOrders);
router.put('/:id/cancel', protectUser, cancelOrder);

// Admin / delivery partner — update status
router.put('/:id/status', protect, updateOrderStatus);

// ── Dynamic :id LAST ──────────────────────────────────────────────────────
// Public — get single order (receipt / confirmation / tracking page)
router.get('/:id', getOrderById);

export default router;
