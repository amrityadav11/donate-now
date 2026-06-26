import express from 'express';
import {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus,
    deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { contactValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/', contactValidation, validate, submitContact);

// Admin routes (protected)
router.get('/', protect, getAllContacts);
router.get('/:id', protect, getContact);
router.put('/:id', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

export default router;
