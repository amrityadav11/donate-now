import express from 'express';
import {
    login,
    getProfile,
    updateProfile,
    changePassword,
    getDashboard,
    createAdmin,
    getAdmins,
    toggleAdminStatus,
    deleteAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { loginValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/dashboard', protect, getDashboard);

// Superadmin only routes
router.post('/create', protect, authorize('superadmin'), createAdmin);
router.get('/all', protect, authorize('superadmin'), getAdmins);
router.put('/:id/toggle-status', protect, authorize('superadmin'), toggleAdminStatus);
router.delete('/:id', protect, authorize('superadmin'), deleteAdmin);

export default router;
