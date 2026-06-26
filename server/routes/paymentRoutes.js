import express from 'express';
import {
    createOrder,
    verifyPayment,
    paymentWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

// Public routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', paymentWebhook);

export default router;
