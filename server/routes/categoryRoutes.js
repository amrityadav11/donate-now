import express from 'express';
import {
    getCategories,
    getCategory,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { categoryValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug); // must come before /:id
router.get('/:id', getCategory);

// Admin routes (protected)
router.post('/', protect, categoryValidation, validate, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);
router.post('/:id/image', protect, uploadCategoryImage);

export default router;
