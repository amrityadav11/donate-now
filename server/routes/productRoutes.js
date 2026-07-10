import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductCategories,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Static routes FIRST ───────────────────────────────────────────────────
router.get('/', getProducts);
router.get('/categories/list', getProductCategories);  // must be before /:id

// Admin only — mutating routes
router.post('/', protect, createProduct);

// ── Dynamic :id ───────────────────────────────────────────────────────────
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
