import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes are sessionId-based — no auth required
router.get('/:sessionId', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/:sessionId', clearCart);

export default router;
